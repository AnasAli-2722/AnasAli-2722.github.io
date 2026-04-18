class GlobalFreelancerLiveStatsWidget extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._clockInterval = null;
        this._nextMinuteTimeout = null;
        this._seed = 2722;
    }

    connectedCallback() {
        this.render();
        this.initializeClock();
        this.populateContributionGrid();
    }

    disconnectedCallback() {
        if (this._clockInterval) clearInterval(this._clockInterval);
        if (this._nextMinuteTimeout) clearTimeout(this._nextMinuteTimeout);
    }

    render() {
        this._shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    min-height: 380px;
                }

                .widget-shell {
                    position: relative;
                    height: 100%;
                    border-radius: 18px;
                    border: 1px solid color-mix(in srgb, var(--text-main) 14%, transparent);
                    background:
                        linear-gradient(160deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01)),
                        var(--bg-secondary);
                    overflow: hidden;
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.36);
                    display: grid;
                    grid-template-rows: 1fr 1px 1fr;
                }

                .divider {
                    background: linear-gradient(
                        90deg,
                        transparent,
                        color-mix(in srgb, var(--text-main) 22%, transparent),
                        transparent
                    );
                }

                .section {
                    padding: 18px;
                    position: relative;
                }

                .section-top {
                    background:
                        radial-gradient(circle at 15% 20%, rgba(59, 197, 181, 0.17), transparent 46%),
                        radial-gradient(circle at 82% 18%, rgba(46, 157, 146, 0.12), transparent 52%);
                }

                .section-top::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
                    background-size: 12px 12px;
                    opacity: 0.18;
                    pointer-events: none;
                }

                .presence-content {
                    position: relative;
                    z-index: 1;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .location-row {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: color-mix(in srgb, var(--text-main) 92%, transparent);
                    font-size: 13px;
                    letter-spacing: 0.3px;
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 999px;
                    background: var(--primary-accent);
                    box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-accent) 70%, transparent);
                    animation: pulse 1.8s ease-out infinite;
                }

                .clock-wrap {
                    margin-top: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .pkt-time {
                    font-family: 'Orbitron', sans-serif;
                    font-size: clamp(1.65rem, 2.8vw, 2.15rem);
                    color: color-mix(in srgb, var(--text-main) 96%, transparent);
                    letter-spacing: 1px;
                    text-shadow: 0 8px 22px rgba(0, 0, 0, 0.55);
                }

                .pkt-label {
                    color: var(--text-muted);
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.9px;
                }

                .availability-badge {
                    margin-top: 12px;
                    align-self: flex-start;
                    border-radius: 999px;
                    padding: 7px 12px;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    color: color-mix(in srgb, var(--text-main) 90%, transparent);
                    border: 1px solid color-mix(in srgb, var(--primary-accent) 65%, transparent);
                    background: linear-gradient(
                        140deg,
                        color-mix(in srgb, var(--primary-accent) 20%, transparent),
                        color-mix(in srgb, var(--secondary-accent) 12%, transparent)
                    );
                    box-shadow: 0 0 24px color-mix(in srgb, var(--primary-accent) 20%, transparent);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                }

                .section-bottom {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .activity-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    font-size: 12px;
                    letter-spacing: 0.45px;
                }

                .activity-title {
                    color: color-mix(in srgb, var(--text-main) 92%, transparent);
                    text-transform: uppercase;
                }

                .activity-handle {
                    color: var(--primary-accent);
                    font-weight: 600;
                }

                .contribution-grid {
                    display: grid;
                    grid-template-columns: repeat(14, 8px);
                    grid-auto-rows: 8px;
                    gap: 2px;
                    align-content: start;
                    padding: 2px 0;
                    min-height: 70px;
                }

                .commit-cell {
                    border-radius: 2px;
                    background: var(--primary-accent);
                    transition: transform 0.2s ease, opacity 0.2s ease;
                }

                .commit-cell:hover {
                    transform: translateY(-1px);
                    opacity: 1 !important;
                }

                .metrics-row {
                    margin-top: auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .metric {
                    border-radius: 10px;
                    border: 1px solid color-mix(in srgb, var(--text-main) 11%, transparent);
                    background: color-mix(in srgb, var(--bg-color) 62%, transparent);
                    padding: 8px 10px;
                }

                .metric-value {
                    color: var(--primary-accent);
                    font-size: 15px;
                    font-weight: 700;
                    line-height: 1.1;
                }

                .metric-label {
                    margin-top: 3px;
                    color: var(--text-muted);
                    font-size: 11px;
                    letter-spacing: 0.25px;
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-accent) 60%, transparent);
                    }
                    70% {
                        box-shadow: 0 0 0 10px color-mix(in srgb, var(--primary-accent) 0%, transparent);
                    }
                    100% {
                        box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-accent) 0%, transparent);
                    }
                }

                @media (max-width: 1200px) {
                    .contribution-grid {
                        grid-template-columns: repeat(12, 8px);
                    }
                }

                @media (max-width: 768px) {
                    :host {
                        min-height: 340px;
                    }

                    .section {
                        padding: 14px;
                    }

                    .contribution-grid {
                        grid-template-columns: repeat(11, 8px);
                    }

                    .availability-badge {
                        font-size: 10px;
                    }
                }
            </style>

            <div class="widget-shell">
                <section class="section section-top" aria-label="Global presence">
                    <div class="presence-content">
                        <div class="location-row">
                            <span class="pulse-dot" aria-hidden="true"></span>
                            <span>Taxila, PK</span>
                        </div>

                        <div class="clock-wrap">
                            <div class="pkt-time" id="pkt-time">--:--</div>
                            <div class="pkt-label">Pakistan Standard Time (PKT)</div>
                            <div class="availability-badge">Available for Global Remote Work</div>
                        </div>
                    </div>
                </section>

                <div class="divider" aria-hidden="true"></div>

                <section class="section section-bottom" aria-label="Developer activity">
                    <div class="activity-header">
                        <span class="activity-title">GitHub Activity</span>
                        <span class="activity-handle">AnasAli-2722</span>
                    </div>

                    <div class="contribution-grid" id="contribution-grid" aria-label="Commit activity heat grid"></div>

                    <div class="metrics-row">
                        <div class="metric">
                            <div class="metric-value">47</div>
                            <div class="metric-label">Recent Commits</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">18 Days</div>
                            <div class="metric-label">Current Streak</div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    initializeClock() {
        const clockElement = this._shadow.getElementById('pkt-time');
        if (!clockElement) return;

        const updateClock = () => {
            const now = new Date();
            const pktString = new Intl.DateTimeFormat('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Karachi'
            }).format(now);

            clockElement.textContent = pktString;
        };

        updateClock();

        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        this._nextMinuteTimeout = setTimeout(() => {
            updateClock();
            this._clockInterval = setInterval(updateClock, 60000);
        }, msUntilNextMinute);
    }

    populateContributionGrid() {
        const gridElement = this._shadow.getElementById('contribution-grid');
        if (!gridElement) return;

        const cellCount = 84;
        const opacities = [0.12, 0.2, 0.32, 0.5, 0.75, 0.95];

        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'commit-cell';
            const opacity = opacities[this.seededRandomIndex(opacities.length)];
            cell.style.opacity = String(opacity);
            gridElement.appendChild(cell);
        }
    }

    seededRandomIndex(max) {
        this._seed = (this._seed * 9301 + 49297) % 233280;
        const random = this._seed / 233280;
        return Math.floor(random * max);
    }
}

customElements.define('global-freelancer-live-stats-widget', GlobalFreelancerLiveStatsWidget);

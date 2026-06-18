// frontend/static/js/dateselector.js
import { getAppleIcon } from './icons.js';

const RELATIVE_PERIODS = {
    'Heute': 'today',
    'Gestern': 'gestern',
    'Diese Woche': 'woche',
    'Letzte 7 Tage': '7tage',
    'Letzte 30 Tage': '30tage',
    'Dieser Monat': 'monat'
};

const STORAGE_KEY = 'em-period-label';

function calcRange(key) {
    const now = new Date();
    let f = new Date(), t = new Date();
    f.setHours(0, 0, 0, 0);
    t.setHours(23, 59, 59, 999);

    switch (key) {
        case 'today': break;
        case 'gestern':
            f.setDate(now.getDate() - 1);
            t.setDate(now.getDate() - 1);
            break;
        case 'woche': {
            const day = now.getDay();
            f.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
            break;
        }
        case '7tage': f.setDate(now.getDate() - 6); break;
        case '30tage': f.setDate(now.getDate() - 29); break;
        case 'monat': f.setDate(1); break;
    }
    return { from: fmtDate(f), to: fmtDate(t) };
}

function fmtDate(d) {
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
}

export function initDateSelector(container, onPeriodChange) {
    let savedLabel = localStorage.getItem(STORAGE_KEY) || 'Heute';

    if (!RELATIVE_PERIODS[savedLabel] && !savedLabel.startsWith('Jahr ') && savedLabel !== 'Individuell') {
        savedLabel = 'Heute';
    }

    const currentYear = new Date().getFullYear();
    let yearOptions = '';

    for (let y = currentYear; y >= 2018; y--) {
        yearOptions += `<option value="${y}">Jahr ${y}</option>`;
    }

    if (!document.getElementById('ds-styles')) {
        const style = document.createElement('style');
        style.id = 'ds-styles';
        style.textContent = `
            .ds-wrap { position: relative; display: inline-flex; align-items: center; gap: 10px; }
            .ds-label { font-size: 14px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .ds-btn {
                padding: 10px 16px; border-radius: 12px;
                border: 1px solid var(--card-border); background: var(--card-bg);
                color: var(--text-main); cursor: pointer; font-size: 14px; font-weight: 600; font-family: inherit;
                box-shadow: var(--shadow-sm); transition: background-color 0.3s, border-color 0.3s;
            }
            .ds-btn::after { content: " ▾"; opacity: .6; }
            .ds-dropdown {
                position: absolute;
                right: 0;
                top: calc(100% + 8px);
                min-width: 240px;
                border-radius: 16px;
                padding: 8px;
                z-index: 9999;
                max-height: 420px;
                overflow-y: auto;
                box-shadow: var(--shadow-md);
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                transition: background-color 0.3s, border-color 0.3s;
            }
            .ds-dropdown.hidden { display: none; }
            .ds-section { font-size: 11px; font-weight: 700; color: var(--text-muted); padding: 8px 12px 4px; text-transform: uppercase; letter-spacing: .5px; }
            .ds-item { padding: 10px 12px; border-radius: 10px; font-size: 14px; color: var(--text-main); cursor: pointer; font-weight: 500; }
            .ds-item:hover { background: var(--bg-color); }
            .ds-item.active { background: var(--apple-blue); color: #ffffff; font-weight: 600; }
            .ds-select { width: calc(100% - 24px); margin: 4px 12px; padding: 8px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--bg-color); color: var(--text-main); font-size: 14px; font-family: inherit; outline: none; }
            .ds-custom { padding: 8px 12px; display: none; }
            .ds-custom.show { display: flex; flex-direction: column; gap: 8px; }
            .ds-custom input { padding: 8px; border-radius: 8px; border: 1px solid var(--card-border); background: var(--bg-color); color: var(--text-main); font-size: 14px; font-family: inherit; outline: none; }
            .ds-custom button { padding: 10px; border-radius: 10px; border: none; background: var(--apple-blue); color: #ffffff; font-size: 14px; cursor: pointer; font-weight: 600; transition: background-color 0.2s; }
            .ds-custom button:hover { opacity: 0.9; }
        `;
        document.head.appendChild(style);
    }

    const wrap = document.createElement('div');
    wrap.className = 'ds-wrap';

    const svgCalendar = getAppleIcon('calendar', 16, 0.7, 5);

    wrap.innerHTML = `
        <span class="ds-label" style="display: inline-flex; align-items: center;">${svgCalendar}Zeitraum:</span>
        <button class="ds-btn" id="dsBtn">${savedLabel}</button>
        <div class="ds-dropdown hidden" id="dsDrop">
            <div class="ds-section">Relativ</div>
            <div class="ds-item" data-key="today">Heute</div>
            <div class="ds-item" data-key="gestern">Gestern</div>
            <div class="ds-item" data-key="woche">Diese Woche</div>
            <div class="ds-item" data-key="7tage">Letzte 7 Tage</div>
            <div class="ds-item" data-key="30tage">Letzte 30 Tage</div>
            <div class="ds-item" data-key="monat">Dieser Monat</div>
            <div class="ds-section">Archiv</div>
            <select class="ds-select" id="dsYear">
                <option value="">Jahr auswählen…</option>
                ${yearOptions}
            </select>
            <div class="ds-section" style="cursor:pointer; margin-top:5px;" id="dsCustomToggle">Individuell…</div>
            <div class="ds-custom" id="dsCustom">
                <input type="date" id="dsFrom">
                <input type="date" id="dsTo">
                <button id="dsApply">Anwenden</button>
            </div>
        </div>
    `;


    container.appendChild(wrap);

    const btn = wrap.querySelector('#dsBtn');
    const drop = wrap.querySelector('#dsDrop');
    const yearSel = wrap.querySelector('#dsYear');
    const customToggle = wrap.querySelector('#dsCustomToggle');
    const customBox = wrap.querySelector('#dsCustom');
    const fromInput = wrap.querySelector('#dsFrom');
    const toInput = wrap.querySelector('#dsTo');
    const applyBtn = wrap.querySelector('#dsApply');

    btn.addEventListener('click', (e) => { e.stopPropagation(); drop.classList.toggle('hidden'); });
    document.addEventListener('click', () => drop.classList.add('hidden'));
    drop.addEventListener('click', (e) => e.stopPropagation());

    customToggle.addEventListener('click', () => customBox.classList.toggle('show'));

    function fire(label, start, end) {
        savedLabel = label;
        localStorage.setItem(STORAGE_KEY, label);
        btn.textContent = label;
        drop.classList.add('hidden');

        drop.querySelectorAll('.ds-item').forEach(el => {
            el.classList.toggle('active', el.textContent.trim() === label);
        });

        onPeriodChange(start, end);
    }

    drop.querySelectorAll('.ds-item').forEach(item => {
        item.addEventListener('click', () => {
            const key = item.getAttribute('data-key');
            const range = calcRange(key);
            fire(item.textContent.trim(), range.from, range.to);
        });
    });

    yearSel.addEventListener('change', () => {
        if (!yearSel.value) return;
        const y = yearSel.value;
        fire(`Jahr ${y}`, `${y}-01-01`, `${y}-12-31`);
    });

    applyBtn.addEventListener('click', () => {
        if (!fromInput.value || !toInput.value) return;
        fire('Individuell', fromInput.value, toInput.value);
    });

    function refreshCurrent() {
        if (RELATIVE_PERIODS[savedLabel]) {
            const range = calcRange(RELATIVE_PERIODS[savedLabel]);
            onPeriodChange(range.from, range.to);
        } else if (savedLabel.startsWith('Jahr ')) {
            const y = savedLabel.replace('Jahr ', '');
            onPeriodChange(`${y}-01-01`, `${y}-12-31`);
        } else {
            onPeriodChange(fromInput.value || fmtDate(new Date()), toInput.value || fmtDate(new Date()));
        }
    }

    return refreshCurrent;
}

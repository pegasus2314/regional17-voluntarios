/* Regional 17 · MUN · Delegate persistence fix */
(() => {
  'use strict';
  const KEY = 'r17_mun_state_v2';

  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{"models":[],"selectedModel":null,"selectedCommission":null}');
    } catch {
      return { models: [], selectedModel: null, selectedCommission: null };
    }
  };

  const write = state => {
    localStorage.setItem(KEY, JSON.stringify(state));
    // Verify the write immediately. This prevents silent failures from leaving
    // the UI looking saved when the state was not actually persisted.
    const verify = JSON.parse(localStorage.getItem(KEY) || '{}');
    return verify;
  };

  document.addEventListener('click', event => {
    const button = event.target.closest?.('#r17DelegatePanel .dp-save');
    if (!button) return;

    const panel = document.getElementById('r17DelegatePanel');
    if (!panel) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const state = read();
    const model = state.models.find(m => m.id === state.selectedModel);
    const commission = model?.commissions?.find(c => c.id === state.selectedCommission);

    const error = panel.querySelector('#dpError');
    const showError = message => {
      if (error) {
        error.textContent = message;
        error.style.display = 'block';
      } else {
        alert(message);
      }
    };

    if (!model || !commission) {
      showError('No se encontró la comisión seleccionada. Vuelve a entrar a la comisión e inténtalo nuevamente.');
      return;
    }

    const name = panel.querySelector('#dpName')?.value.trim() || '';
    if (!name) {
      showError('El nombre completo es obligatorio.');
      panel.querySelector('#dpName')?.focus();
      return;
    }

    const email = panel.querySelector('#dpEmail')?.value.trim() || '';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      showError('Revisa el correo electrónico.');
      panel.querySelector('#dpEmail')?.focus();
      return;
    }

    const countryCode = panel.querySelector('#dpCountry')?.value || 'DO';
    const countries = {
      DO:['República Dominicana','🇩🇴'],US:['Estados Unidos','🇺🇸'],CN:['China','🇨🇳'],FR:['Francia','🇫🇷'],RU:['Rusia','🇷🇺'],GB:['Reino Unido','🇬🇧'],PS:['Palestina','🇵🇸'],MX:['México','🇲🇽'],BR:['Brasil','🇧🇷'],CO:['Colombia','🇨🇴'],ES:['España','🇪🇸'],DE:['Alemania','🇩🇪'],AR:['Argentina','🇦🇷'],CL:['Chile','🇨🇱'],PE:['Perú','🇵🇪'],UY:['Uruguay','🇺🇾'],EC:['Ecuador','🇪🇨'],BO:['Bolivia','🇧🇴'],CR:['Costa Rica','🇨🇷'],PA:['Panamá','🇵🇦'],GT:['Guatemala','🇬🇹'],HN:['Honduras','🇭🇳'],SV:['El Salvador','🇸🇻'],NI:['Nicaragua','🇳🇮'],CA:['Canadá','🇨🇦'],JP:['Japón','🇯🇵'],KR:['Corea del Sur','🇰🇷'],IN:['India','🇮🇳'],IT:['Italia','🇮🇹'],PT:['Portugal','🇵🇹'],NL:['Países Bajos','🇳🇱'],SE:['Suecia','🇸🇪'],NO:['Noruega','🇳🇴'],CH:['Suiza','🇨🇭'],ZA:['Sudáfrica','🇿🇦'],EG:['Egipto','🇪🇬'],NG:['Nigeria','🇳🇬'],KE:['Kenia','🇰🇪'],AU:['Australia','🇦🇺']
    };
    const country = countries[countryCode] || ['País no especificado','🌎'];

    if (!Array.isArray(commission.delegations)) commission.delegations = [];
    const duplicate = commission.delegations.some(d =>
      String(d.name || '').trim().toLowerCase() === name.toLowerCase() &&
      String(d.country || '') === country[0]
    );
    if (duplicate) {
      showError('Este delegado ya está registrado en esta comisión.');
      return;
    }

    commission.delegations.push({
      id: crypto.randomUUID(),
      country: country[0],
      flag: country[1],
      code: countryCode,
      name,
      email,
      phone: panel.querySelector('#dpPhone')?.value.trim() || '',
      district: panel.querySelector('#dpDistrict')?.value || '',
      institution: panel.querySelector('#dpInstitution')?.value.trim() || '',
      role: panel.querySelector('#dpRole')?.value || 'Delegado',
      attendance: false,
      result: 'pendiente'
    });

    state.selectedModel = model.id;
    state.selectedCommission = commission.id;

    try {
      const verified = write(state);
      const savedModel = verified.models?.find(m => m.id === model.id);
      const savedCommission = savedModel?.commissions?.find(c => c.id === commission.id);
      const saved = savedCommission?.delegations?.some(d => d.id === commission.delegations.at(-1).id);
      if (!saved) throw new Error('La verificación del guardado falló.');

      button.disabled = true;
      button.textContent = '✓ Guardado';
      panel.querySelectorAll('input,select,button').forEach(el => {
        if (el !== button) el.disabled = true;
      });

      // The MUN renderer keeps its initial state in memory. A full reload makes
      // it read the just-verified localStorage state and display the delegate.
      setTimeout(() => window.location.reload(), 180);
    } catch (err) {
      console.error('[MUN] Error guardando delegado:', err);
      showError('No se pudo guardar el delegado. El estado no fue modificado.');
    }
  }, true);
})();

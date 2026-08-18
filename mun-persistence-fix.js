/* Regional 17 · MUN · Persistencia de comisiones y delegados
   Corrige la actualización visual: el módulo anterior conserva un snapshot viejo del estado.
   Después de guardar, se recarga la aplicación usando el estado recién persistido.
*/
(() => {
  'use strict';
  const KEY = 'r17_mun_state_v2';

  const read = () => JSON.parse(localStorage.getItem(KEY) || '{"models":[],"selectedModel":null,"selectedCommission":null}');
  const write = state => localStorage.setItem(KEY, JSON.stringify(state));

  function replaceSaveButton(form) {
    const save = form.querySelector('.vbtn.save');
    if (!save || save.dataset.persistenceFixed === '1') return;
    save.dataset.persistenceFixed = '1';

    const replacement = save.cloneNode(true);
    save.replaceWith(replacement);

    replacement.addEventListener('click', () => {
      const state = read();
      const model = state.models.find(m => m.id === state.selectedModel);
      if (!model) return;

      const title = form.querySelector('h2')?.textContent?.trim() || '';

      if (title === 'Registrar comisión') {
        const name = form.querySelector('#vcn')?.value.trim();
        if (!name) {
          form.querySelector('#vcn')?.focus();
          return;
        }

        if (!Array.isArray(model.commissions)) model.commissions = [];

        const duplicate = model.commissions.some(c =>
          String(c.name || '').trim().toLowerCase() === name.toLowerCase()
        );
        if (duplicate) {
          alert('Ya existe una comisión con ese nombre en este modelo.');
          return;
        }

        const commission = {
          id: crypto.randomUUID(),
          name,
          delegations: [],
          type: form.querySelector('#vct')?.value || 'Comisión ONU',
          capacity: Number(form.querySelector('#vcc')?.value) || 20,
          topic: form.querySelector('#vctopic')?.value.trim() || '',
          description: form.querySelector('#vcdesc')?.value.trim() || ''
        };

        model.commissions.push(commission);
        state.selectedModel = model.id;
        state.selectedCommission = commission.id;
        write(state);
        window.location.reload();
        return;
      }

      if (title === 'Registrar delegado') {
        const name = form.querySelector('#vdname')?.value.trim();
        if (!name) {
          form.querySelector('#vdname')?.focus();
          return;
        }

        const commission = model.commissions?.find(c => c.id === state.selectedCommission);
        if (!commission) return;
        if (!Array.isArray(commission.delegations)) commission.delegations = [];

        const countries = {
          DO:['República Dominicana','🇩🇴'], US:['Estados Unidos','🇺🇸'], CN:['China','🇨🇳'],
          FR:['Francia','🇫🇷'], RU:['Rusia','🇷🇺'], GB:['Reino Unido','🇬🇧'], PS:['Palestina','🇵🇸'],
          MX:['México','🇲🇽'], BR:['Brasil','🇧🇷'], CO:['Colombia','🇨🇴'], ES:['España','🇪🇸'],
          DE:['Alemania','🇩🇪'], AR:['Argentina','🇦🇷'], CL:['Chile','🇨🇱'], PE:['Perú','🇵🇪'],
          UY:['Uruguay','🇺🇾'], EC:['Ecuador','🇪🇨'], BO:['Bolivia','🇧🇴'], CR:['Costa Rica','🇨🇷'],
          PA:['Panamá','🇵🇦'], GT:['Guatemala','🇬🇹'], HN:['Honduras','🇭🇳'], SV:['El Salvador','🇸🇻'],
          NI:['Nicaragua','🇳🇮'], CA:['Canadá','🇨🇦'], JP:['Japón','🇯🇵'], KR:['Corea del Sur','🇰🇷'],
          IN:['India','🇮🇳'], IT:['Italia','🇮🇹'], PT:['Portugal','🇵🇹'], NL:['Países Bajos','🇳🇱'],
          SE:['Suecia','🇸🇪'], NO:['Noruega','🇳🇴'], CH:['Suiza','🇨🇭'], ZA:['Sudáfrica','🇿🇦'],
          EG:['Egipto','🇪🇬'], NG:['Nigeria','🇳🇬'], KE:['Kenia','🇰🇪'], AU:['Australia','🇦🇺']
        };

        const code = form.querySelector('#vdcountry')?.value || 'DO';
        const country = countries[code] || ['País no especificado','🌎'];
        const email = form.querySelector('#vdemail')?.value.trim() || '';

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
          alert('Revisa el correo electrónico.');
          form.querySelector('#vdemail')?.focus();
          return;
        }

        commission.delegations.push({
          id: crypto.randomUUID(),
          country: country[0],
          flag: country[1],
          code,
          name,
          email,
          phone: form.querySelector('#vdphone')?.value.trim() || '',
          district: form.querySelector('#vddistrict')?.value || '',
          attendance: false,
          result: 'pendiente'
        });

        state.selectedModel = model.id;
        state.selectedCommission = commission.id;
        write(state);
        window.location.reload();
      }
    });
  }

  const observer = new MutationObserver(() => {
    const form = document.getElementById('r17VisualMunForm');
    if (form) replaceSaveButton(form);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();

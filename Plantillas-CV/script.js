
document.addEventListener('DOMContentLoaded', () => {
    console.log("Controlador: Inicializando la aplicación de CV Dinámico...");

    // INTERRUPTOR DINÁMICO DE PLANTILLAS
    const templateSelect = document.getElementById('form-template-select');
    const stylesheetLink = document.getElementById('cv-template-link');

    if (templateSelect && stylesheetLink) {
        templateSelect.addEventListener('change', () => {
            const selectedTemplate = templateSelect.value;
            console.log(`Controlador: Cambiando hoja de estilos activa a -> [${selectedTemplate}]`);
            
            // Reemplaza el href del link para cargar los nuevos estilos CSS
            stylesheetLink.setAttribute('href', selectedTemplate);
        });
    }

    // REGISTRO DE SELECTORES
    const fixedFields = {
        name: { input: document.getElementById('form-name'), view: document.getElementById('cv-name') },
        role: { input: document.getElementById('form-role'), view: document.getElementById('cv-role') },
        photo: { input: document.getElementById('form-photo'), view: document.getElementById('cv-photo') },
        phone: { input: document.getElementById('form-phone'), view: document.getElementById('cv-phone') },
        email: { input: document.getElementById('form-email'), view: document.getElementById('cv-email') },
        portfolio: { input: document.getElementById('form-portfolio'), view: document.getElementById('cv-portfolio') },
        github: { input: document.getElementById('form-github'), view: document.getElementById('cv-github') },
        linkedin: { input: document.getElementById('form-linkedin'), view: document.getElementById('cv-linkedin') },
        summary: { input: document.getElementById('form-summary'), view: document.getElementById('cv-summary') },
        interests: { input: document.getElementById('form-interests'), view: document.getElementById('cv-interests') }
    };

    // ENLACE DE EVENTOS PARA CAMPOS
    Object.keys(fixedFields).forEach(key => {
        const field = fixedFields[key];
        if (field.input && field.view) {
            field.input.addEventListener('input', () => {
                if (key === 'photo') {
                    field.view.src = field.input.value;
                } else {
                    field.view.textContent = field.input.value;
                }
            });
        }
    });

    // MÓDULO DE GESTIÓN DE ELEMENTOS DINÁMICOS

    function createDynamicItem(sectionName, formContainerId, previewContainerId, formHtmlStructure, previewHtmlStructure, setupListenersCallback) {
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000); 
        console.log(`Servicio: Añadiendo elemento dinámico a [${sectionName}] con ID único: ${uniqueId}`);

        const formContainer = document.getElementById(formContainerId);
        const previewContainer = document.getElementById(previewContainerId);

        const rawFormHtml = formHtmlStructure.replaceAll('{{id}}', uniqueId);
        const rawPreviewHtml = previewHtmlStructure.replaceAll('{{id}}', uniqueId);

        formContainer.insertAdjacentHTML('beforeend', rawFormHtml);
        previewContainer.insertAdjacentHTML('beforeend', rawPreviewHtml);

        const deleteBtn = document.getElementById(`btn-del-${sectionName}-${uniqueId}`);
        deleteBtn.addEventListener('click', () => {
            console.log(`Servicio: Eliminando elemento dinámico [${sectionName}] ID: ${uniqueId}`);
            document.getElementById(`form-block-${sectionName}-${uniqueId}`).remove();
            document.getElementById(`preview-block-${sectionName}-${uniqueId}`).remove();
        });

        setupListenersCallback(uniqueId);
    }

    // IMPLEMENTACIÓN DE SECCIONES DINÁMICAS

    // 1. SECCIÓN: HABILIDADES
    document.getElementById('btn-add-skill').addEventListener('click', () => {
        const formTpl = `
            <div class="dynamic-block" id="form-block-skill-{{id}}">
                <label>Categoría (Ej: Frontend, Idiomas...)</label>
                <input type="text" id="input-skill-cat-{{id}}" placeholder="Ej: Bases de Datos">
                <label>Tecnologías / Certificaciones</label>
                <input type="text" id="input-skill-list-{{id}}" placeholder="Ej: MongoDB, SQL Server, PostgreSQL">
                <button type="button" class="btn-delete" id="btn-del-skill-{{id}}">Eliminar Categoría</button>
            </div>`;
        
        const previewTpl = `
            <div id="preview-block-skill-{{id}}" style="margin-top: 6px;">
                <h4 id="view-skill-cat-{{id}}"></h4>
                <p id="view-skill-list-{{id}}" style="font-size: 12px; line-height: 1.4;"></p>
            </div>`;

        createDynamicItem('skill', 'skills-form-container', 'cv-skills-container', formTpl, previewTpl, (id) => {
            const inCat = document.getElementById(`input-skill-cat-${id}`);
            const inList = document.getElementById(`input-skill-list-${id}`);
            const viewCat = document.getElementById(`view-skill-cat-${id}`);
            const viewList = document.getElementById(`view-skill-list-${id}`);

            inCat.addEventListener('input', () => viewCat.textContent = inCat.value);
            inList.addEventListener('input', () => viewList.textContent = inList.value);
        });
    });

    // 2. SECCIÓN: EXPERIENCIA LABORAL
    document.getElementById('btn-add-experience').addEventListener('click', () => {
        const formTpl = `
            <div class="dynamic-block" id="form-block-exp-{{id}}">
                <div class="grid-2-col">
                    <div>
                        <label>Empresa y Ubicación</label>
                        <input type="text" id="input-exp-comp-{{id}}">
                    </div>
                    <div>
                        <label>Periodo</label>
                        <input type="text" id="input-exp-date-{{id}}">
                    </div>
                </div>
                <label>Puesto Ocupado</label>
                <input type="text" id="input-exp-role-{{id}}">
                <label>Tareas (Líneas comenzando por guion para viñetas)</label>
                <textarea id="input-exp-desc-{{id}}" rows="3"></textarea>
                <button type="button" class="btn-delete" id="btn-del-exp-{{id}}">Eliminar Experiencia</button>
            </div>`;

        const previewTpl = `
            <div class="experience-item" id="preview-block-exp-{{id}}" style="margin-bottom: 12px;">
                <div class="item-header">
                    <strong id="view-exp-role-{{id}}"></strong>
                    <span id="view-exp-date-{{id}}" class="date-badge"></span>
                </div>
                <div id="view-exp-comp-{{id}}" class="company-name"></div>
                <ul id="view-exp-desc-{{id}}" class="bullets-list"></ul>
            </div>`;

        createDynamicItem('exp', 'experience-form-container', 'cv-experience-container', formTpl, previewTpl, (id) => {
            const inComp = document.getElementById(`input-exp-comp-${id}`);
            const inDate = document.getElementById(`input-exp-date-${id}`);
            const inRole = document.getElementById(`input-exp-role-${id}`);
            const inDesc = document.getElementById(`input-exp-desc-${id}`);

            const viewComp = document.getElementById(`view-exp-comp-${id}`);
            const viewDate = document.getElementById(`view-exp-date-${id}`);
            const viewRole = document.getElementById(`view-exp-role-${id}`);
            const viewDesc = document.getElementById(`view-exp-desc-${id}`);

            inComp.addEventListener('input', () => viewComp.textContent = inComp.value);
            inDate.addEventListener('input', () => viewDate.textContent = inDate.value);
            inRole.addEventListener('input', () => viewRole.textContent = inRole.value);
            
            inDesc.addEventListener('input', () => {
                viewDesc.innerHTML = '';
                const lines = inDesc.value.split('\n');
                lines.forEach(line => {
                    if (line.trim().length > 0) {
                        const li = document.createElement('li');
                        li.textContent = line.replace(/^-/, '').trim();
                        viewDesc.appendChild(li);
                    }
                });
            });
        });
    });

    // 3. SECCIÓN: FORMACIÓN ACADÉMICA
    document.getElementById('btn-add-education').addEventListener('click', () => {
        const formTpl = `
            <div class="dynamic-block" id="form-block-edu-{{id}}">
                <label>Titulación Oficial</label>
                <input type="text" id="input-edu-title-{{id}}">
                <div class="grid-2-col">
                    <div>
                        <label>Centro Educativo</label>
                        <input type="text" id="input-edu-school-{{id}}">
                    </div>
                    <div>
                        <label>Año / Promoción</label>
                        <input type="text" id="input-edu-date-{{id}}">
                    </div>
                </div>
                <button type="button" class="btn-delete" id="btn-del-edu-{{id}}">Eliminar Formación</button>
            </div>`;

        const previewTpl = `
            <div class="education-item" id="preview-block-edu-{{id}}" style="margin-bottom: 10px;">
                <div class="item-header">
                    <strong id="view-edu-title-{{id}}"></strong>
                    <span id="view-edu-date-{{id}}" class="date-badge"></span>
                </div>
                <div id="view-edu-school-{{id}}" class="school-name"></div>
            </div>`;

        createDynamicItem('edu', 'education-form-container', 'cv-education-container', formTpl, previewTpl, (id) => {
            const inTitle = document.getElementById(`input-edu-title-${id}`);
            const inSchool = document.getElementById(`input-edu-school-${id}`);
            const inDate = document.getElementById(`input-edu-date-${id}`);

            const viewTitle = document.getElementById(`view-edu-title-${id}`);
            const viewSchool = document.getElementById(`view-edu-school-${id}`);
            const viewDate = document.getElementById(`view-edu-date-${id}`);

            inTitle.addEventListener('input', () => viewTitle.textContent = inTitle.value);
            inSchool.addEventListener('input', () => viewSchool.textContent = inSchool.value);
            inDate.addEventListener('input', () => viewDate.textContent = inDate.value);
        });
    });

    // 4. SECCIÓN: PROYECTOS DESTACADOS
    document.getElementById('btn-add-project').addEventListener('click', () => {
        const formTpl = `
            <div class="dynamic-block" id="form-block-proj-{{id}}">
                <label>Nombre del Proyecto</label>
                <input type="text" id="input-proj-title-{{id}}">
                <label>Descripción y Tecnologías</label>
                <textarea id="input-proj-desc-{{id}}" rows="3"></textarea>
                <button type="button" class="btn-delete" id="btn-del-proj-{{id}}">Eliminar Proyecto</button>
            </div>`;

        const previewTpl = `
            <div class="project-item" id="preview-block-proj-{{id}}" style="margin-bottom: 10px;">
                <strong id="view-proj-title-{{id}}"></strong>
                <p id="view-proj-desc-{{id}}" class="justify-text" style="margin-top: 2px; font-size: 12px;"></p>
            </div>`;

        createDynamicItem('proj', 'projects-form-container', 'cv-projects-container', formTpl, previewTpl, (id) => {
            const inTitle = document.getElementById(`input-proj-title-${id}`);
            const inDesc = document.getElementById(`input-proj-desc-${id}`);

            const viewTitle = document.getElementById(`view-proj-title-${id}`);
            const viewDesc = document.getElementById(`view-proj-desc-${id}`);

            inTitle.addEventListener('input', () => viewTitle.textContent = inTitle.value);
            inDesc.addEventListener('input', () => viewDesc.textContent = inDesc.value);
        });
    });

    // --- ACCIÓN: LANZAR IMPRESIÓN NATIVA DEL SISTEMA ---
    document.getElementById('btn-download').addEventListener('click', () => {
        console.log("Controlador: Ejecutando comando window.print()...");
        window.print();
    });

    // --- INICIALIZACIÓN DE PRECARGA POR DEFECTO ---
    document.getElementById('btn-add-skill').click();
    document.getElementById('btn-add-experience').click();
    document.getElementById('btn-add-education').click();
    document.getElementById('btn-add-project').click();

    Object.keys(fixedFields).forEach(key => {
        if(fixedFields[key].input) fixedFields[key].input.dispatchEvent(new Event('input'));
    });
});
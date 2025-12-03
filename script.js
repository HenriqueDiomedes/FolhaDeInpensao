class InspecaoVeicular {
    constructor() {
        this.formData = {};
        this.colors = ['#00f359ff', '#ffb700ff', '#f70d0dff', '#d2d7dfff'];
        this.isSW4Selected = false;

        // Lista de itens (mantida igual)
        this.itensParteInterna = [
            'Relógio e computador de bordo',
            'Luzes do painel e de cortesia •',
            'Lavadores e limpadores',
            'Ventilador / Desembaçadores',
            'Retrovisor e para-sóis',
            'Buzina',
            'Volante e coluna de direção',
            'Aquecedor elétrico dos bancos(se aplicável)',
            'Ar-condicionado •',
            'Rádio / Multimidia • △',
            'Bancos e cintos de segurança',
            'Vidros e trava elétrica',
            'Freios de estacionamento',
            'Pedal de freio',
            'Filtro de ar da bateria hibrido',
            'Filtro de ar - condicionado',
            'Kit de troca(medidor e filtro de sucção a cada 72.000 km(motor flex) ⚠ ',
        ];

        this.itensFluidos = [
            'Óleo do motor *',
            'Nível do lavador de para-brisa *',
            'Fluido do sistema de arrefecimento do motor',
            'Nível de fluido de arrefecimento',
            'Fluido de freios e Embreagem',
            'Óleo equipado com vareta de inspeção',
            'Óleo de transmissão manual',
            'Fluido de direção hidráulica (se aplicável)',
            'Óleo na caixa de transferência (se aplicável)',
            'Óleo do diferencial dianteiro e traseiro (se aplicável)',
            'Nível e linha de inflação'
        ];

        this.itensEmbaixoVeiculo = [
            'Caixa de direção e barra de direção',
            'Juntas homocinéticas',
            'Vazamento de óleo, água, combustível e/ou outros líquidos',
            'Sistema de escapamento',
            'Vazamento de fluido do freio',
            'Mangueiras de freio',
            'Suspensão dianteira e traseira',
            'Pneus e rodas',
            'Câmbio de caixa do aplicável',
            'Diferencial dianteiro',
            'Sensor de freio e rodas',
            'Unidade elétrica: eixo de tração caixa e',
            'Parafuso de árvore de transmissão',
            'Bateria do sistema do freio de estacionamento caixa'
        ];

        this.itensParteExterna = [
            'Iluminação dianteira e traseira e/ou farol xenon •⚠',
            'Tampa do combustível',
            'Fumaça do motor(motor dissel)'
        ];

        this.itensCapoAberto = [
            'Vazamentos de óleo, água, combustivel e/ou outros fluidos',
            'Correias de acionamento',
            'Folga das válvulas(se aplicável)',
            'Velas de ignição(conforme ano/modelo do veiculo)',
            'Condições da bateria △',
            `<span style="display: inline-flex; align-items: center; gap: 4px;">
                Tensão da bateria Encontrada:
                <input type="text" class="battery-voltage-input" placeholder="" maxlength="4">
                •
            </span>`,
            'Cânister de carvão ativado (se aplicáve) ⚠',
            'Filtro de ar',
            'Filtro de combustivel(motor dissel ou flex)',
            'Filtro de combustivel (2º filtro) (se aplicável)',
        ];

        // Inicializar com um pequeno delay para garantir que o DOM está pronto
        setTimeout(() => this.init(), 100);
    }

    init() {
        console.log('=== INICIALIZANDO SISTEMA DE INSPEÇÃO ===');
        
        // 1. Renderizar listas
        this.renderAllLists();
        
        // 2. Inicializar status boxes
        this.initializeStatusBoxes();
        
        // 3. Inicializar outros componentes
        this.initializeCarSelect();
        this.initializeInputs();
        this.initializeBrakesSection();
        this.initializeServiceCheckboxes();
        this.initializeBatteryInputs();
        
        console.log('✅ Sistema inicializado com sucesso!');
        console.log('🔍 Para testar: Selecione "SW4" no dropdown');
    }

    renderAllLists() {
        console.log('Renderizando listas...');
        
        this.renderItemsList('parte-interna-list', this.itensParteInterna, 'pi');
        this.renderItemsList('parte-externa-list', this.itensParteExterna, 'pe');
        this.renderItemsList('capo-aberto-list', this.itensCapoAberto, 'ca');
        this.renderItemsList('fluidos-list', this.itensFluidos, 'fl');
        this.renderItemsList('embaixo-veiculo-list', this.itensEmbaixoVeiculo, 'ev');
        
        console.log('✅ Listas renderizadas');
    }

    renderItemsList(containerId, items, prefix) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container ${containerId} não encontrado!`);
            return;
        }

        container.innerHTML = items.map((item, index) => `
            <div class="item-row" data-id="${prefix}-${index}" data-original-text="${item.replace(/"/g, '&quot;')}">
                <div class="item-name">${item}</div>
                <div class="status-box-container" data-id="${prefix}-${index}"></div>
            </div>
        `).join('');
    }

    // MÉTODO PRINCIPAL: Inicializar dropdown de carros
    initializeCarSelect() {
        const carSelect = document.getElementById('car-select');
        if (!carSelect) {
            console.error('❌ Dropdown de carros não encontrado!');
            return;
        }
        
        console.log('✅ Dropdown de carros encontrado');
        
        carSelect.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            console.log(`🚗 Carro selecionado: ${selectedValue}`);
            
            if (selectedValue === 'sw4') {
                console.log('🎯 SW4 selecionado - aplicando cortes...');
                this.isSW4Selected = true;
                carSelect.style.backgroundColor = '#fef3c7';
                carSelect.style.borderColor = '#f59e0b';
                carSelect.style.fontWeight = 'bold';
                
                // Aplicar cortes com um pequeno delay para garantir renderização
                setTimeout(() => {
                    this.applySW4Cuts();
                }, 50);
                
            } else {
                console.log('🔄 Outro carro selecionado - removendo cortes...');
                this.isSW4Selected = false;
                carSelect.style.backgroundColor = 'white';
                carSelect.style.borderColor = '#9ca3af';
                carSelect.style.fontWeight = 'normal';
                
                // Remover cortes
                this.removeAllCuts();
            }
        });
    }

    // MÉTODO: Aplicar cortes do SW4
    applySW4Cuts() {
        console.log('=== APLICANDO CORTES DO SW4 ===');
        
        // Lista de itens que devem ser CORTADOS no SW4
        const itemsToCut = [
            // Parte Interna
            'Filtro de ar da bateria hibrido',
            'Kit de troca(medidor e filtro de sucção a cada 72.000 km(motor flex) ⚠ ',
            
            // Capo Aberto
            'Folga das válvulas(se aplicável)',
            'Velas de ignição(conforme ano/modelo do veiculo)',
            'Cânister de carvão ativado (se aplicáve) ⚠',
            
            // Fluidos
            'Óleo de transmissão manual',
        ];
        
        let itemsCut = 0;
        
        // Procurar cada item na lista
        itemsToCut.forEach(itemText => {
            console.log(`🔍 Procurando: "${itemText.substring(0, 40)}..."`);
            
            // Encontrar o item no DOM
            const itemRow = this.findItemByText(itemText);
            
            if (itemRow) {
                console.log(`✅ Encontrado! ID: ${itemRow.getAttribute('data-id')}`);
                this.markItemAsCut(itemRow);
                itemsCut++;
            } else {
                console.warn(`⚠️ Item não encontrado: "${itemText}"`);
            }
        });
        
        console.log(`📊 Total de itens cortados: ${itemsCut}`);
        
        if (itemsCut > 0) {
            this.showMessage(`SW4: ${itemsCut} itens cortados automaticamente`);
        }
    }

    // MÉTODO AUXILIAR: Encontrar item pelo texto
    findItemByText(searchText) {
        // Procurar em todas as linhas de item
        const allItemRows = document.querySelectorAll('.item-row');
        
        for (const row of allItemRows) {
            const itemNameElement = row.querySelector('.item-name');
            if (!itemNameElement) continue;
            
            // Pegar texto do item
            const text = this.extractTextFromElement(itemNameElement);
            
            // Comparar (ignorando espaços extras e case)
            const cleanSearch = searchText.trim().toLowerCase();
            const cleanText = text.trim().toLowerCase();
            
            if (cleanText.includes(cleanSearch) || cleanSearch.includes(cleanText)) {
                return row;
            }
        }
        
        return null;
    }

    // MÉTODO AUXILIAR: Extrair texto de elemento (mesmo com HTML)
    extractTextFromElement(element) {
        // Se tem HTML dentro, usar textContent
        if (element.innerHTML !== element.textContent) {
            return element.textContent || '';
        }
        // Senão, usar innerText
        return element.innerText || element.textContent || '';
    }

    // MÉTODO: Marcar item como "cortado" (todos os 4 quadradinhos)
    markItemAsCut(itemRow) {
        const itemId = itemRow.getAttribute('data-id');
        console.log(`🛠️ Cortando item: ${itemId}`);
        
        // Salvar no formData
        this.formData[itemId] = [0, 1, 2, 3]; // Todos os 4 status
        
        // Encontrar container dos quadradinhos
        const container = itemRow.querySelector('.status-box-container');
        if (!container) {
            console.error(`❌ Container não encontrado para ${itemId}`);
            return;
        }
        
        // Encontrar todos os botões
        const buttons = container.querySelectorAll('.status-button');
        if (buttons.length !== 4) {
            console.error(`❌ Não tem 4 botões em ${itemId} (tem ${buttons.length})`);
            return;
        }
        
        console.log(`🎨 Aplicando estilo aos 4 botões de ${itemId}`);
        
        // Marcar cada botão
        buttons.forEach((button, index) => {
            // 1. Marcar como "checked" (mostra o ✓)
            button.classList.add('checked');
            
            // 2. Aumentar opacidade e borda
            button.style.opacity = '1';
            button.style.borderWidth = '2px';
            
            // 3. Adicionar "strikethrough" (mostra o X)
            button.classList.add('strikethrough');
            
            // 4. Atualizar no formData
            this.formData[itemId] = this.formData[itemId] || [];
            if (!this.formData[itemId].includes(index)) {
                this.formData[itemId].push(index);
            }
        });
        
        // Adicionar linha cortada
        itemRow.classList.add('all-checked');
        
        console.log(`✅ Item ${itemId} cortado com sucesso!`);
    }

    // MÉTODO: Remover todos os cortes
    removeAllCuts() {
        console.log('🧹 Removendo todos os cortes...');
        
        // 1. Remover estilo dos botões
        const cutButtons = document.querySelectorAll('.status-button.strikethrough');
        console.log(`Removendo strikethrough de ${cutButtons.length} botões`);
        
        cutButtons.forEach(button => {
            button.classList.remove('strikethrough');
            button.classList.remove('checked');
            button.style.opacity = '0.3';
            button.style.borderWidth = '1px';
        });
        
        // 2. Remover linha cortada
        const cutRows = document.querySelectorAll('.item-row.all-checked');
        console.log(`Removendo all-checked de ${cutRows.length} linhas`);
        
        cutRows.forEach(row => {
            row.classList.remove('all-checked');
        });
        
        // 3. Limpar formData dos itens cortados
        Object.keys(this.formData).forEach(key => {
            if (key.match(/^(pi|ca|fl|ev|pe)-\d+$/)) {
                if (Array.isArray(this.formData[key]) && this.formData[key].length === 4) {
                    delete this.formData[key];
                }
            }
        });
        
        console.log('✅ Cortes removidos!');
    }

    // MÉTODO: Mostrar mensagem
    showMessage(text) {
        // Remover mensagem anterior
        const oldMsg = document.querySelector('.system-message');
        if (oldMsg) oldMsg.remove();
        
        // Criar nova mensagem
        const msg = document.createElement('div');
        msg.className = 'system-message no-print';
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            padding: 12px 16px;
            background: #f59e0b;
            color: black;
            border-radius: 6px;
            font-size: 13px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            border-left: 4px solid #d97706;
            animation: fadeIn 0.3s ease-in;
        `;
        
        document.body.appendChild(msg);
        
        // Adicionar animação CSS
        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover após 4 segundos
        setTimeout(() => {
            if (msg.parentNode) {
                msg.style.opacity = '0';
                msg.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (msg.parentNode) msg.remove();
                }, 500);
            }
        }, 4000);
    }

    // ============================================
    // MÉTODOS DE INICIALIZAÇÃO DOS COMPONENTES
    // ============================================
    
    initializeStatusBoxes() {
        console.log('Inicializando status boxes...');
        
        const containers = document.querySelectorAll('.items-list .status-box-container');
        console.log(`Encontrados ${containers.length} containers`);
        
        containers.forEach(container => {
            const id = container.getAttribute('data-id');
            if (id) {
                this.createStatusBox(container, id);
            }
        });
        
        console.log('✅ Status boxes inicializados');
    }

    createStatusBox(container, id) {
        const statusBox = document.createElement('div');
        statusBox.className = 'status-box';

        this.colors.forEach((color, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'status-button';
            button.style.backgroundColor = color;
            button.dataset.index = index;

            // Verificar se já está marcado (para SW4)
            if (this.formData[id] && this.formData[id].includes(index)) {
                button.classList.add('checked');
                button.style.opacity = '1';
                button.style.borderWidth = '2px';
                
                // Se todos os 4 estão marcados, adicionar strikethrough
                if (this.formData[id].length === 4) {
                    button.classList.add('strikethrough');
                }
            } else {
                button.style.opacity = '0.3';
                button.style.borderWidth = '1px';
            }

            button.addEventListener('click', () => {
                // Se for SW4 e item está cortado, não permitir alterar
                if (this.isSW4Selected && this.formData[id] && this.formData[id].length === 4) {
                    this.showMessage('Este item não pode ser alterado no SW4');
                    return;
                }
                
                this.toggleStatusValue(id, index);
                this.updateStatusBox(container, id);
                this.updateItemRowStyle(id);
            });

            statusBox.appendChild(button);
        });

        container.appendChild(statusBox);
        this.updateItemRowStyle(id);
    }

    toggleStatusValue(id, value) {
        if (!this.formData[id]) {
            this.formData[id] = [];
        }

        const index = this.formData[id].indexOf(value);
        if (index > -1) {
            this.formData[id].splice(index, 1);
        } else {
            this.formData[id].push(value);
        }

        this.checkAllCheckedForStrike(id);
    }

    updateStatusBox(container, id) {
        const buttons = container.querySelectorAll('.status-button');
        const checkedValues = this.formData[id] || [];

        buttons.forEach((button, index) => {
            const buttonIndex = parseInt(button.dataset.index) || index;
            const isChecked = checkedValues.includes(buttonIndex);

            if (isChecked) {
                button.classList.add('checked');
                button.style.opacity = '1';
                button.style.borderWidth = '2px';
            } else {
                button.classList.remove('checked');
                button.style.opacity = '0.3';
                button.style.borderWidth = '1px';
            }
        });
    }

    updateItemRowStyle(id) {
        const itemRow = document.querySelector(`.item-row[data-id="${id}"]`);
        const checkedValues = this.formData[id] || [];

        if (itemRow) {
            const allChecked = checkedValues.length === 4;
            if (allChecked) {
                itemRow.classList.add('all-checked');
            } else {
                itemRow.classList.remove('all-checked');
            }
        }
    }

    checkAllCheckedForStrike(id) {
        const container = document.querySelector(`.status-box-container[data-id="${id}"]`);
        if (!container) return;

        const buttons = container.querySelectorAll('.status-button');
        const checkedValues = this.formData[id] || [];
        const allChecked = checkedValues.length === 4;

        buttons.forEach(button => {
            if (allChecked) {
                button.classList.add('strikethrough');
            } else {
                button.classList.remove('strikethrough');
            }
        });
    }

    initializeInputs() {
        const tireInputs = document.querySelectorAll('.tire-input');
        tireInputs.forEach(input => {
            const key = input.getAttribute('data-key');
            
            if (this.formData[key]) {
                input.value = this.formData[key];
            }
            
            input.addEventListener('input', (e) => {
                this.formData[key] = e.target.value;
            });
        });
    }

    initializeServiceCheckboxes() {
        const checkboxes = document.querySelectorAll('.service-checkbox');
        checkboxes.forEach((checkbox, index) => {
            const serviceKey = `service-checkbox-${index}`;
            if (this.formData[serviceKey]) {
                checkbox.checked = true;
            }
            
            checkbox.addEventListener('change', (e) => {
                this.formData[serviceKey] = e.target.checked;
            });
        });
    }

    initializeBatteryInputs() {
        const batteryInputs = document.querySelectorAll('.battery-voltage-input');
        batteryInputs.forEach((input, index) => {
            const key = `battery-voltage-${index}`;
            
            if (this.formData[key]) {
                input.value = this.formData[key];
            }
            
            input.addEventListener('input', (e) => {
                this.formData[key] = e.target.value;
            });
        });
    }

    initializeBrakesSection() {
        document.querySelectorAll('.brake-input').forEach(input => {
            const key = input.getAttribute('data-key');

            if (this.formData[key]) {
                input.value = this.formData[key];
            }

            input.addEventListener('input', (e) => {
                const value = e.target.value;
                this.formData[key] = value;
                this.checkAndApplyStrikeThrough(key, value);
            });
        });

        document.querySelectorAll('.brakes-content .status-boxes').forEach(container => {
            const key = container.getAttribute('data-key');
            const boxes = container.querySelectorAll('.status-box');

            if (!this.formData[key]) {
                this.formData[key] = [];
            }

            const checkedValues = this.formData[key] || [];
            boxes.forEach((box, index) => {
                const isChecked = checkedValues.includes(index);

                if (isChecked) {
                    box.classList.add('checked');
                    box.style.opacity = '1';
                    box.style.borderWidth = '2px';
                } else {
                    box.classList.remove('checked');
                    box.style.opacity = '0.3';
                    box.style.borderWidth = '1px';
                }
            });

            boxes.forEach((box, index) => {
                box.addEventListener('click', () => {
                    this.toggleBrakeStatusValue(key, index);
                    this.updateBrakeStatusBox(container, key);
                });
            });
        });
    }

    checkAndApplyStrikeThrough(inputKey, value) {
        const statusKey = inputKey + '-status';
        const container = document.querySelector(`.status-boxes[data-key="${statusKey}"]`);

        if (!container) return;

        const boxes = container.querySelectorAll('.status-box');
        const shouldStrike = value === '-' || value === '_' || value === '*';

        boxes.forEach(box => {
            if (shouldStrike) {
                box.classList.add('strikethrough');
            } else {
                box.classList.remove('strikethrough');
            }
        });

        if (shouldStrike) {
            this.formData[statusKey] = [];
            this.updateBrakeStatusBox(container, statusKey);
        }
    }

    toggleBrakeStatusValue(key, value) {
        if (!this.formData[key]) {
            this.formData[key] = [];
        }

        const inputKey = key.replace('-status', '');
        const inputValue = this.formData[inputKey];
        const hasStrike = inputValue === '-' || inputValue === '_' || inputValue === '*';

        if (hasStrike) return;

        const index = this.formData[key].indexOf(value);
        if (index > -1) {
            this.formData[key].splice(index, 1);
        } else {
            this.formData[key].push(value);
        }

        this.checkAllBrakesCheckedForStrike(key);
    }

    checkAllBrakesCheckedForStrike(key) {
        const container = document.querySelector(`.status-boxes[data-key="${key}"]`);
        if (!container) return;

        const boxes = container.querySelectorAll('.status-box');
        const checkedValues = this.formData[key] || [];
        const allChecked = checkedValues.length === 4;

        boxes.forEach(box => {
            if (allChecked) {
                box.classList.add('strikethrough');
            } else {
                box.classList.remove('strikethrough');
            }
        });
    }

    updateBrakeStatusBox(container, key) {
        const boxes = container.querySelectorAll('.status-box');
        const checkedValues = this.formData[key] || [];

        boxes.forEach((box, index) => {
            const isChecked = checkedValues.includes(index);

            if (isChecked) {
                box.classList.add('checked');
                box.style.opacity = '1';
                box.style.borderWidth = '2px';
            } else {
                box.classList.remove('checked');
                box.style.opacity = '0.3';
                box.style.borderWidth = '1px';
            }
        });
    }

    // MÉTODO PARA DEBUG: Verificar todos os itens
    debugItems() {
        console.log('=== DEBUG: LISTA DE ITENS ===');
        const items = document.querySelectorAll('.item-row');
        console.log(`Total de itens: ${items.length}`);
        
        items.forEach((row, i) => {
            const id = row.getAttribute('data-id');
            const nameElement = row.querySelector('.item-name');
            let text = 'Sem texto';
            
            if (nameElement) {
                text = nameElement.textContent || nameElement.innerText || 'Vazio';
                if (text.length > 50) text = text.substring(0, 50) + '...';
            }
            
            console.log(`${i}. ${id}: "${text}"`);
        });
    }
}

// ============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Carregado - Iniciando aplicação...');
    
    const app = new InspecaoVeicular();
    window.inspecaoApp = app;
    
    // Botão de impressão
    const printButton = document.createElement('button');
    printButton.innerHTML = '🖨️ Imprimir';
    printButton.className = 'print-button no-print';
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 18px;
        background: #038013ff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
    `;
    
    printButton.onclick = () => {
        console.log('🖨️ Iniciando impressão...');
        document.body.classList.add('print-mode');
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.classList.remove('print-mode');
                console.log('✅ Impressão concluída');
            }, 500);
        }, 800);
    };
    
    document.body.appendChild(printButton);
    
    // Botão de debug (apenas desenvolvimento)
    if (window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')) {
        const debugBtn = document.createElement('button');
        debugBtn.textContent = '🐛 Debug';
        debugBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10000;
            font-size: 12px;
        `;
        debugBtn.onclick = () => app.debugItems();
        document.body.appendChild(debugBtn);
    }
    
    console.log('🚀 Aplicação Toyota pronta para uso!');
    console.log('👉 Selecione "SW4" no dropdown para testar os cortes automáticos');
});
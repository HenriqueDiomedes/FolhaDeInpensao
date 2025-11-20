class InspecaoVeicular {
    constructor() {
        this.formData = {};
        this.colors = ['#00f359ff', '#ffb700ff', '#f70d0dff', '#d2d7dfff'];

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
            'Iluminação dianteira e traseira e/ou farol xenon *',
            'Tampa do combustível',
            'Formação de motor(motor dissel)'
        ];

        this.itensCapoAberto = [
            'Vazamentos de óleo, água, combustivel e/ou outros',
            'Nível de óleo do motor',
            'Cor e estado do óleo do motor',
            'Fluido de freio',
            'Fluido de direção hidráulica',
            'Líquido de arrefecimento',
            'Água do radiador',
            'Bateria e bornes',
            'Correia do alternador',
            'Correia de comando (se aplicável)',
            'Filtro de ar do motor',
            'Vazamentos em geral',
            'Limpeza do compartimento do motor'
        ];

        this.init();
    }

    init() {
        this.renderItemsList('parte-interna-list', this.itensParteInterna, 'pi');
        this.renderItemsList('parte-externa-list', this.itensParteExterna, 'pe');
        this.renderItemsList('capo-aberto-list', this.itensCapoAberto, 'ca');
        this.renderItemsList('fluidos-list', this.itensFluidos, 'fl');
        this.renderItemsList('embaixo-veiculo-list', this.itensEmbaixoVeiculo, 'ev');

        this.initializeStatusBoxes();
        this.initializeInputs();
        this.initializeBrakesSection();
    }

    renderItemsList(containerId, items, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = items.map((item, index) => `
            <div class="item-row" data-id="${prefix}-${index}">
                <div class="item-name">${item}</div>
                <div class="status-box-container" data-id="${prefix}-${index}"></div>
            </div>
        `).join('');
    }

    initializeStatusBoxes() {
        const containers = document.querySelectorAll('.items-list .status-box-container');
        containers.forEach(container => {
            const id = container.getAttribute('data-id');
            this.createStatusBox(container, id);
        });
    }

    createStatusBox(container, id) {
        const statusBox = document.createElement('div');
        statusBox.className = 'status-box';

        this.colors.forEach((color, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'status-button';
            button.style.backgroundColor = color;

            if (!this.formData[id]) {
                this.formData[id] = [];
            }

            const isChecked = this.formData[id].includes(index);

            if (isChecked) {
                button.classList.add('checked');
                button.style.opacity = '1';
                button.style.borderWidth = '2px';
            } else {
                button.style.opacity = '0.3';
                button.style.borderWidth = '1px';
            }

            button.addEventListener('click', () => {
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

        console.log('Form data updated:', this.formData);
        
        // Verificar se todos estão marcados para aplicar X
        this.checkAllCheckedForStrike(id);
    }

    updateStatusBox(container, id) {
        const buttons = container.querySelectorAll('.status-button');
        const checkedValues = this.formData[id] || [];

        buttons.forEach((button, index) => {
            const isChecked = checkedValues.includes(index);

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

    // NOVO MÉTODO: Verificar se todos estão marcados e aplicar X
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
        // Inputs de calibragem de pneus
        const tireInputs = ['dianteiro-esq', 'dianteiro-dir', 'traseiro-esq', 'traseiro-dir', 'estepe'];
        tireInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.formData[id] = e.target.value;
                    console.log('Form data updated:', this.formData);
                });
            }
        });

        // Checkboxes de tipo de serviço
        const checkboxes = document.querySelectorAll('.service-checkbox');
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                const serviceTypes = ['inspecao-gratuita', 'troca-oleo', 'reparacao', 'garantia'];
                this.formData[serviceTypes[index]] = e.target.checked;
                console.log('Form data updated:', this.formData);
            });
        });
    }

    // MÉTODO ATUALIZADO: Inicialização da seção de freios
    initializeBrakesSection() {
        // Configurar event listeners para inputs de freios
        document.querySelectorAll('.brake-input').forEach(input => {
            const key = input.getAttribute('data-key');
            
            // Carregar valor salvo
            if (this.formData[key]) {
                input.value = this.formData[key];
            }
            
            // Salvar quando o valor mudar
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                this.formData[key] = value;
                
                // Verificar se deve aplicar risco nos quadradinhos
                this.checkAndApplyStrikeThrough(key, value);
                
                console.log('Form data updated:', this.formData);
            });
        });
        
        // Configurar event listeners para status boxes de freios
        document.querySelectorAll('.brakes-content .status-boxes').forEach(container => {
            const key = container.getAttribute('data-key');
            const boxes = container.querySelectorAll('.status-box');
            
            // Inicializar array se não existir
            if (!this.formData[key]) {
                this.formData[key] = [];
            }
            
            // Carregar estado salvo
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
            
            // Configurar clique para múltipla seleção
            boxes.forEach((box, index) => {
                box.addEventListener('click', () => {
                    this.toggleBrakeStatusValue(key, index);
                    this.updateBrakeStatusBox(container, key);
                });
            });
        });
    }

    // MÉTODO: Verificar e aplicar risco nos quadradinhos dos freios
    checkAndApplyStrikeThrough(inputKey, value) {
        // Encontrar o container de status boxes correspondente
        const statusKey = inputKey + '-status';
        const container = document.querySelector(`.status-boxes[data-key="${statusKey}"]`);
        
        if (!container) return;
        
        const boxes = container.querySelectorAll('.status-box');
        
        // Verificar se o valor é '-', '_' ou '*'
        const shouldStrike = value === '-' || value === '_' || value === '*';
        
        // Aplicar ou remover a classe de risco
        boxes.forEach(box => {
            if (shouldStrike) {
                box.classList.add('strikethrough');
            } else {
                box.classList.remove('strikethrough');
            }
        });
        
        // Se aplicou risco, limpar qualquer seleção existente
        if (shouldStrike) {
            this.formData[statusKey] = [];
            this.updateBrakeStatusBox(container, statusKey);
        }
    }

    // MÉTODO: Toggle para valores dos freios
    toggleBrakeStatusValue(key, value) {
        if (!this.formData[key]) {
            this.formData[key] = [];
        }
        
        // Verificar se há risco aplicado (não permite marcar se houver risco)
        const inputKey = key.replace('-status', '');
        const inputValue = this.formData[inputKey];
        const hasStrike = inputValue === '-' || inputValue === '_' || inputValue === '*';
        
        if (hasStrike) {
            return; // Não permite marcar se há risco
        }
        
        const index = this.formData[key].indexOf(value);
        if (index > -1) {
            this.formData[key].splice(index, 1);
        } else {
            this.formData[key].push(value);
        }
        
        console.log('Form data updated:', this.formData);
        
        // Verificar se todos estão marcados para aplicar X
        this.checkAllBrakesCheckedForStrike(key);
    }

    // NOVO MÉTODO: Verificar se todos os quadradinhos dos freios estão marcados
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

    // MÉTODO: Atualizar visual dos quadradinhos dos freios
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
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new InspecaoVeicular();
});
// Função para imprimir corretamente
function imprimirCorretamente() {
    // Adiciona classe para modo impressão
    document.body.classList.add('print-mode');
    
    console.log('Preparando para impressão...');
    
    // Delay um pouco maior para garantir tudo carregar
    setTimeout(() => {
        console.log('Abrindo janela de impressão...');
        window.print();
        
        // Remove a classe após a impressão
        setTimeout(() => {
            document.body.classList.remove('print-mode');
            console.log('Impressão concluída');
        }, 500);
    }, 800);
}

// Adiciona botão de impressão
document.addEventListener('DOMContentLoaded', function() {
    // Remove botão anterior se existir
    const oldButton = document.querySelector('.print-button');
    if (oldButton) oldButton.remove();
    
    const printButton = document.createElement('button');
    printButton.innerHTML = '🖨️ Imprimir Formulário';
    printButton.className = 'print-button no-print';
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 18px;
        background: #dc2626;
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
    printButton.onclick = imprimirCorretamente;
    document.body.appendChild(printButton);
    
    console.log('Botão de impressão adicionado');
});
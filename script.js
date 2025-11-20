class InspecaoVeicular {
    constructor() {
        this.formData = {};
        this.colors = ['#22c55e', '#fbbf24', '#ef4444', '#9ca3af'];

        this.itensCapoAberto = [
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

        this.itensParteInterna = [
            'Relógio e computador de bordo',
            'Funcionamento dos controles',
            'Comandos do painel / limpador / ventilador / desembaçadores',
            'Ar quente',
            'Buzina',
            'Trava e coluna de direção',
            'Ruídos, vibrações ou batidas não-aplicáveis',
            'A/: condicionado A',
            'A/c: Automático / A',
            'Bancos e cintos de segurança',
            'Vidros e travas elétricas',
            'Retrovisor interno',
            'Painel de freio',
            'Sistema de ar-condicionado',
            'Filtro de ar da cabine / filtrado',
            'Substituição de elemento de A/C (acúmulo e obstruções)'
        ];

        this.itensFluidos = [
            'Óleo do motor *',
            'Nível do lavador de para-brisa *',
            'Fluido do sistema de arrefecimento do motor',
            'Nível de fluido de arrefecimento',
            'Fluido de freios',
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
            'Iluminação dianteira e traseira (não-farol) alto e baixo',
            'Limpador de para-brisa',
            'Formação de motor jrrador diantil'
        ];

        this.itensLuzesDianteiro = [
            'Farol baixo, médio e alto',
            'Pisca - esquerdo e direito',
            'Farol de neblina'
        ];

        this.init();
    }

    init() {
        this.renderItemsList('capo-aberto-list', this.itensCapoAberto, 'ca');
        this.renderItemsList('parte-interna-list', this.itensParteInterna, 'pi');
        this.renderItemsList('fluidos-list', this.itensFluidos, 'fl');
        this.renderItemsList('embaixo-veiculo-list', this.itensEmbaixoVeiculo, 'ev');
        this.renderItemsList('parte-externa-list', this.itensParteExterna, 'pe');
        this.renderItemsList('luzes-diant-list', this.itensLuzesDianteiro, 'ld');

        this.initializeStatusBoxes();
        this.initializeInputs();
    }

    renderItemsList(containerId, items, prefix) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = items.map((item, index) => `
            <div class="item-row">
                <div class="item-name">${item}</div>
                <div class="status-box-container" data-id="${prefix}-${index}"></div>
            </div>
        `).join('');
    }

    initializeStatusBoxes() {
        const containers = document.querySelectorAll('.status-box-container');
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

            if (this.formData[id] === index) {
                button.classList.add('active');
                button.style.borderWidth = '2px';
            } else {
                button.style.opacity = '0.3';
                button.style.borderWidth = '1px';
            }

            button.addEventListener('click', () => {
                this.setStatusValue(id, index);
                this.updateStatusBox(container, id);
            });

            statusBox.appendChild(button);
        });

        container.appendChild(statusBox);
    }

    updateStatusBox(container, id) {
        const buttons = container.querySelectorAll('.status-button');
        const currentValue = this.formData[id];

        buttons.forEach((button, index) => {
            if (currentValue === index) {
                button.classList.add('active');
                button.style.borderWidth = '2px';
                button.style.opacity = '1';
            } else {
                button.classList.remove('active');
                button.style.borderWidth = '1px';
                button.style.opacity = '0.3';
            }
        });
    }

    setStatusValue(id, value) {
        this.formData[id] = value;
        console.log('Form data updated:', this.formData);
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

        // Inputs de freios
        const brakeInputs = ['pneu-diant-esq', 'pneu-diant-dir', 'pneu-tras-esq', 'pneu-tras-dir'];
        brakeInputs.forEach(id => {
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
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new InspecaoVeicular();
});
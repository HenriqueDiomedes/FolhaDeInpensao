// Estado do formulário
let tireData = {
    dianteiroEsq: '',
    dianteiroDir: '',
    traseiroEsq: '',
    traseiroDir: '',
    estepe: ''
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    // Configurar event listeners para inputs
    document.querySelectorAll('.tire-input').forEach(input => {
        const key = input.getAttribute('data-key');
        
        // Carregar valor salvo
        if (tireData[key]) {
            input.value = tireData[key];
            updateTireVisualization(key, tireData[key]);
        }
        
        // Salvar quando o valor mudar
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            tireData[key] = value;
            updateTireVisualization(key, value);
            saveTireData();
        });
        
        // Validar entrada (apenas números)
        input.addEventListener('keypress', (e) => {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
            }
        });
    });
    
    // Carregar dados salvos do localStorage
    loadTireData();
});

// Função para atualizar a visualização do pneu
function updateTireVisualization(tireKey, value) {
    const valueElement = document.getElementById(getTireValueId(tireKey));
    const circleElement = valueElement.closest('.tire-circle');
    
    if (value && !isNaN(value)) {
        const psi = parseInt(value);
        valueElement.textContent = `${psi} psi`;
        
        // Remover todas as classes de status
        circleElement.classList.remove('optimal', 'low', 'high', 'empty');
        
        // Adicionar classe baseada na pressão
        if (psi >= 28 && psi <= 32) {
            circleElement.classList.add('optimal');
        } else if (psi < 28) {
            circleElement.classList.add('low');
        } else if (psi > 32) {
            circleElement.classList.add('high');
        }
    } else {
        valueElement.textContent = '--';
        circleElement.classList.remove('optimal', 'low', 'high');
        circleElement.classList.add('empty');
    }
}

// Função para mapear chaves para IDs de elementos
function getTireValueId(tireKey) {
    const mapping = {
        'dianteiroEsq': 'front-left-value',
        'dianteiroDir': 'front-right-value',
        'traseiroEsq': 'rear-left-value',
        'traseiroDir': 'rear-right-value',
        'estepe': 'spare-value'
    };
    return mapping[tireKey];
}

// Função para salvar dados no localStorage
function saveTireData() {
    localStorage.setItem('tireCalibrationData', JSON.stringify(tireData));
    console.log('Dados dos pneus salvos:', tireData);
}

// Função para carregar dados do localStorage
function loadTireData() {
    const savedData = localStorage.getItem('tireCalibrationData');
    if (savedData) {
        tireData = { ...tireData, ...JSON.parse(savedData) };
        
        // Atualizar inputs e visualização
        Object.keys(tireData).forEach(key => {
            const input = document.querySelector(`.tire-input[data-key="${key}"]`);
            if (input) {
                input.value = tireData[key];
                updateTireVisualization(key, tireData[key]);
            }
        });
    }
}

// Função para calcular estatísticas
function getTireStats() {
    const values = Object.values(tireData)
        .filter(val => val && !isNaN(val))
        .map(val => parseInt(val));
    
    if (values.length === 0) return null;
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return {
        average: Math.round(avg * 10) / 10,
        min: min,
        max: max,
        count: values.length
    };
}

// Função para verificar se todos os pneus estão calibrados
function checkAllTiresCalibrated() {
    const stats = getTireStats();
    if (!stats) return false;
    
    // Considera calibrado se todos os valores estão entre 28-32 psi
    return stats.min >= 28 && stats.max <= 32;
}

// Função para exportar dados (pode ser usada para enviar para servidor)
function exportTireData() {
    const stats = getTireStats();
    const data = {
        ...tireData,
        stats: stats,
        allCalibrated: checkAllTiresCalibrated(),
        timestamp: new Date().toISOString()
    };
    
    console.log('Dados para exportação:', data);
    return data;
}

// Função para limpar todos os dados
function clearTireData() {
    if (confirm('Tem certeza que deseja limpar todos os dados de calibragem?')) {
        tireData = {
            dianteiroEsq: '',
            dianteiroDir: '',
            traseiroEsq: '',
            traseiroDir: '',
            estepe: ''
        };
        
        document.querySelectorAll('.tire-input').forEach(input => {
            input.value = '';
            const key = input.getAttribute('data-key');
            updateTireVisualization(key, '');
        });
        
        localStorage.removeItem('tireCalibrationData');
    }
}

// Adicionar botões de controle (opcional)
function addControlButtons() {
    const controls = document.createElement('div');
    controls.className = 'tire-controls';
    controls.innerHTML = `
        <button onclick="exportTireData()" class="control-btn export-btn">Exportar Dados</button>
        <button onclick="clearTireData()" class="control-btn clear-btn">Limpar Tudo</button>
    `;
    
    document.querySelector('.tire-content').appendChild(controls);
}

// Estilos para botões de controle (opcional)
const controlStyles = `
.tire-controls {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
}

.control-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.export-btn {
    background-color: #3b82f6;
    color: white;
}

.export-btn:hover {
    background-color: #2563eb;
}

.clear-btn {
    background-color: #ef4444;
    color: white;
}

.clear-btn:hover {
    background-color: #dc2626;
}
`;

// Adicionar estilos dos botões se necessário
const styleSheet = document.createElement('style');
styleSheet.textContent = controlStyles;
document.head.appendChild(styleSheet);

// Adicionar botões de controle (descomente se quiser usar)
// addControlButtons();
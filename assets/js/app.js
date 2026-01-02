/**
 * BingoEd - Aplicación de Bingo Virtual
 *
 * @description Aplicación web profesional de bingo con modo multijugador
 * @version 1.0.0
 * @author BingoEd Team
 * @license MIT
 */

// ===== CONFIGURACIÓN Y CONSTANTES =====
const CONFIG = {
    APP_NAME: 'BingoEd',
    VERSION: '1.0.0',
    MAX_PLAYERS: 30,
    MAX_CARDS_PER_PLAYER: 6,
    TOTAL_NUMBERS: 75,
    PEER_CONFIG: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ],
    },
};

// Productos típicos de bingo
const BINGO_PRODUCTS = [
    // Electrodomésticos
    'Licuadora',
    'Batidora',
    'Cafetera',
    'Sandwichera',
    'Horno Microondas',
    'Plancha',
    'Ventilador',
    'Aspiradora',
    'Freidora de Aire',
    'Olla Arrocera',

    // Tecnología
    'Tablet',
    'Smart TV 32"',
    'Smart TV 43"',
    'Smart TV 50"',
    'Audífonos Bluetooth',
    'Parlante Bluetooth',
    'Smartwatch',
    'Mouse Inalámbrico',
    'Teclado Inalámbrico',
    'Cámara Web',

    // Hogar y Confort
    'Juego de Sábanas',
    'Almohadas Premium',
    'Cobijas',
    'Toallas de Baño',
    'Set de Ollas',
    'Vajilla Completa',
    'Cubiertos',

    // Mercado y Despensa
    'Mercado Completo',
    'Canasta Familiar',
    'Bono de Supermercado $100,000',
    'Bono de Supermercado $200,000',

    // Experiencias y Viajes
    'Viaje a San Andrés',
    'Viaje a Cartagena',
    'Fin de Semana en Hotel',
    'Día en Parque Temático',
    'Cena para Dos',

    // Otros
    'Bicicleta',
    'Set de Herramientas',
    'Kit de Belleza',
    'Corte de Cabello y Spa',
    'Bono de Ropa $150,000',
    'Personalizado...',
];

// ===== ESTADO DE LA APLICACIÓN =====
class BingoApp {
    constructor() {
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            autoPlay: false,
            calledNumbers: [],
            currentNumber: null,
            cards: [],
            winners: [],
            hasWinner: false,
            startTime: null,
            gameTime: 0,
            timerInterval: null,
            autoDrawInterval: null,
        };

        this.config = {
            playerName: 'Jugador 1',
            numCards: 2,
            gameMode: 'classic',
            autoMark: true,
            drawSpeed: 2000,
            soundEnabled: true,
            darkTheme: false,
            colorTheme: 'default',
            showAnimations: true,
            chatEnabled: false,
        };

        this.stats = {
            gamesPlayed: 0,
            bingosWon: 0,
            numberFrequency: {},
            totalTime: 0,
        };

        // Premios
        this.prizes = {
            firstLine: { type: 'money', value: 50000, description: '$50,000 COP' },
            secondLine: { type: 'money', value: 100000, description: '$100,000 COP' },
            bingo: { type: 'money', value: 300000, description: '$300,000 COP' },
            currency: 'COP',
        };

        // Configuración Corporativa
        this.corporate = {
            enabled: false,
            companyName: '',
            nit: '',
            address: '',
            logoUrl: '',
        };

        // Chat
        this.chat = {
            enabled: false,
            messages: [],
        };

        // Multijugador
        this.multiplayer = {
            enabled: false,
            isHost: false,
            peer: null,
            peerId: null,
            connections: new Map(),
            players: new Map(),
            roomCode: null,
            nextCardNumber: 1, // Contador global de cartones
        };

        this.roomCode = this.generateRoomCode();
        this.loadStats();
        this.loadPrizes();
        this.loadCorporateSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateNumbersGrid();
        this.loadTheme();
        this.updatePrizesDisplay(); // Mostrar los premios guardados al cargar
        this.updateCorporateBanner(); // Mostrar banner corporativo si está configurado
    }

    // ===== GENERACIÓN DE CÓDIGOS Y UTILIDADES =====
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            if (i === 4) code += '-';
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Configuración Inicial
        document.getElementById('startGame').addEventListener('click', () => this.startNewGame());
        document
            .getElementById('gameType')
            .addEventListener('change', e => this.handleGameTypeChange(e.target.value));

        // Controles del Juego
        document.getElementById('drawBall').addEventListener('click', () => this.drawNumber());
        document.getElementById('autoDraw').addEventListener('click', () => this.toggleAutoDraw());
        document.getElementById('pauseGame').addEventListener('click', () => this.pauseGame());
        document.getElementById('newGame').addEventListener('click', () => this.resetGame());

        // Acciones Rápidas
        document.getElementById('checkBingo').addEventListener('click', () => this.checkAllCards());
        document.getElementById('printCards').addEventListener('click', () => this.printCards());
        document.getElementById('shareGame').addEventListener('click', () => this.shareGame());

        // Administrador
        document.getElementById('adminBtn').addEventListener('click', () => this.openAdminPanel());
        document
            .getElementById('closeAdmin')
            .addEventListener('click', () => this.closeAdminPanel());
        document
            .getElementById('copyRoomCode')
            .addEventListener('click', () => this.copyRoomCodeToClipboard());

        // Tabs del Admin
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', e => this.switchTab(e.target.dataset.tab));
        });

        // Premios
        document.getElementById('savePrizes').addEventListener('click', () => this.savePrizes());
        document
            .getElementById('prize1Type')
            .addEventListener('change', e => this.updatePrizeCurrency('prize1', e.target.value));
        document
            .getElementById('prize2Type')
            .addEventListener('change', e => this.updatePrizeCurrency('prize2', e.target.value));
        document
            .getElementById('prizeBingoType')
            .addEventListener('change', e =>
                this.updatePrizeCurrency('prizeBingo', e.target.value)
            );

        // Configuración
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        document
            .getElementById('colorTheme')
            .addEventListener('change', e => this.changeColorTheme(e.target.value));
        document
            .getElementById('showAnimations')
            .addEventListener('change', e => this.toggleAnimations(e.target.checked));
        document
            .getElementById('enableChat')
            .addEventListener('change', e => this.toggleChat(e.target.checked));
        document.getElementById('resetStats').addEventListener('click', () => this.resetStats());

        // Configuración Corporativa
        document
            .getElementById('companyLogo')
            .addEventListener('change', e => this.handleLogoUpload(e));
        document
            .getElementById('saveCorporateSettings')
            .addEventListener('click', () => this.saveCorporateSettings());

        const removeLogo = document.getElementById('removeLogo');
        if (removeLogo) {
            removeLogo.addEventListener('click', () => this.removeLogo());
        }

        // Chat
        const sendMessage = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        if (sendMessage) {
            sendMessage.addEventListener('click', () => this.sendChatMessage());
        }
        if (chatInput) {
            chatInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
        }

        // Modal de Ganador
        document
            .getElementById('continueGame')
            .addEventListener('click', () => this.closeWinnerModal());

        // Teclado
        document.addEventListener('keydown', e => {
            // Ignorar si el usuario está escribiendo en un campo de texto
            const activeElement = document.activeElement;
            const isInputField =
                activeElement &&
                (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.isContentEditable);

            if (e.code === 'Space' && this.gameState.isPlaying && !isInputField) {
                e.preventDefault();
                this.drawNumber();
            }
        });
    }
    // ===== CONFIGURACIÓN MULTIJUGADOR =====
    handleGameTypeChange(type) {
        const joinCodeGroup = document.getElementById('joinCodeGroup');

        if (type === 'join') {
            joinCodeGroup.style.display = 'flex';
        } else {
            joinCodeGroup.style.display = 'none';
        }
    }

    initializeMultiplayer(type, joinCode = null) {
        this.multiplayer.enabled = true;

        if (type === 'host') {
            this.setupHost();
        } else if (type === 'join' && joinCode) {
            this.joinRoom(joinCode);
        }
    }

    setupHost() {
        this.multiplayer.isHost = true;
        this.multiplayer.roomCode = this.generateRoomCode();

        // Inicializar PeerJS
        this.multiplayer.peer = new Peer(this.multiplayer.roomCode, {
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                ],
            },
        });

        this.multiplayer.peer.on('open', id => {
            this.multiplayer.peerId = id;
            console.log('Sala creada con código:', id);
            this.updateConnectionUI('host');
            this.updateRoomUI();
        });

        this.multiplayer.peer.on('connection', conn => {
            this.handleNewConnection(conn);
        });

        this.multiplayer.peer.on('error', err => {
            console.error('Error en PeerJS:', err);
            alert('Error al crear la sala. Intenta nuevamente.');
        });

        // Agregar anfitrión a la lista de jugadores
        this.multiplayer.players.set('host', {
            id: 'host',
            name: this.config.playerName,
            numCards: this.config.numCards,
            isHost: true,
            cards: [],
        });
    }

    joinRoom(roomCode) {
        this.multiplayer.isHost = false;
        this.multiplayer.roomCode = roomCode.toUpperCase();

        // Verificar si hay una sesión previa
        const savedSession = localStorage.getItem(`session_${roomCode}`);
        let sessionData = null;
        if (savedSession) {
            sessionData = JSON.parse(savedSession);
            console.log('Sesión previa encontrada:', sessionData);
        }

        // Inicializar PeerJS
        this.multiplayer.peer = new Peer({
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                ],
            },
        });

        this.multiplayer.peer.on('open', id => {
            this.multiplayer.peerId = id;
            console.log('Conectando a sala:', this.multiplayer.roomCode);

            // Conectar con el anfitrión
            const conn = this.multiplayer.peer.connect(this.multiplayer.roomCode);

            conn.on('open', () => {
                console.log('Conectado al anfitrión');
                this.multiplayer.connections.set('host', conn);

                // Enviar información del jugador (con datos de sesión si existen)
                conn.send({
                    type: 'player_join',
                    data: {
                        id: id,
                        name: this.config.playerName,
                        numCards: this.config.numCards,
                        sessionId: sessionData ? sessionData.sessionId : Date.now(),
                        previousCards: sessionData ? sessionData.cards : null,
                    },
                });

                this.updateConnectionUI('connected');
            });

            conn.on('data', data => {
                this.handleMultiplayerMessage(data, conn);
            });

            conn.on('close', () => {
                console.log('Desconectado del anfitrión');
                this.updateConnectionUI('disconnected');
            });

            conn.on('error', err => {
                console.error('Error de conexión:', err);
                alert('No se pudo conectar a la sala. Verifica el código.');
                this.updateConnectionUI('disconnected');
            });
        });

        this.multiplayer.peer.on('error', err => {
            console.error('Error en PeerJS:', err);
            alert('Error al unirse a la sala. Verifica el código.');
        });
    }

    handleNewConnection(conn) {
        console.log('Nuevo jugador conectando...');

        conn.on('open', () => {
            console.log('Jugador conectado');
        });

        conn.on('data', data => {
            this.handleMultiplayerMessage(data, conn);
        });

        conn.on('close', () => {
            // Remover jugador de la lista
            for (const [id, connection] of this.multiplayer.connections) {
                if (connection === conn) {
                    const player = this.multiplayer.players.get(id);
                    const playerName = player ? player.name : 'Jugador';
                    const playerCards = player ? player.cards : [];

                    // Marcar cartones como desconectados en lugar de eliminar
                    if (player) {
                        player.disconnected = true;
                        player.disconnectedAt = Date.now();
                        this.multiplayer.players.set(id, player);
                    }

                    this.multiplayer.connections.delete(id);
                    this.updatePlayersUI();

                    // Notificar a todos los jugadores
                    this.addSystemMessage(`${playerName} se ha desconectado`);
                    this.broadcastToPlayers({
                        type: 'player_list',
                        data: Array.from(this.multiplayer.players.values()),
                    });

                    // Log para el anfitrión
                    if (playerCards.length > 0) {
                        console.log(`Cartones huérfanos: #${playerCards.join(', #')}`);
                    }
                    break;
                }
            }
        });
    }

    handleMultiplayerMessage(data, conn) {
        switch (data.type) {
            case 'player_join':
                if (this.multiplayer.isHost) {
                    // Verificar si es una reconexión
                    let existingPlayer = null;
                    if (data.data.sessionId) {
                        // Buscar jugador con mismo sessionId
                        for (const [playerId, player] of this.multiplayer.players) {
                            if (player.sessionId === data.data.sessionId) {
                                existingPlayer = player;
                                // Eliminar la entrada antigua
                                this.multiplayer.players.delete(playerId);
                                this.multiplayer.connections.delete(playerId);
                                break;
                            }
                        }
                    }

                    // Si es reconexión, mantener cartones previos
                    const playerCards = existingPlayer
                        ? existingPlayer.cards
                        : data.data.cards || [];

                    // Agregar jugador a la lista
                    this.multiplayer.players.set(data.data.id, {
                        ...data.data,
                        isHost: false,
                        cards: playerCards,
                        sessionId: data.data.sessionId || Date.now(),
                    });
                    this.multiplayer.connections.set(data.data.id, conn);

                    // Si es reconexión, notificar
                    if (existingPlayer) {
                        this.addSystemMessage(`${data.data.name} se ha reconectado`);
                    }

                    // Enviar estado actual del juego
                    conn.send({
                        type: 'game_state',
                        data: {
                            calledNumbers: this.gameState.calledNumbers,
                            currentNumber: this.gameState.currentNumber,
                            isPlaying: this.gameState.isPlaying,
                            gameMode: this.config.gameMode,
                            drawSpeed: this.config.drawSpeed,
                            chatEnabled: this.chat.enabled,
                            corporate: this.corporate,
                            nextCardNumber: this.multiplayer.nextCardNumber,
                            players: Array.from(this.multiplayer.players.values()),
                        },
                    });

                    // Notificar a todos los jugadores
                    this.broadcastToPlayers({
                        type: 'player_list',
                        data: Array.from(this.multiplayer.players.values()),
                    });

                    this.updatePlayersUI();
                }
                break;

            case 'number_drawn':
                if (!this.multiplayer.isHost) {
                    // Actualizar número sorteado
                    const number = data.data.number;
                    if (!this.gameState.calledNumbers.includes(number)) {
                        this.gameState.calledNumbers.push(number);
                        this.gameState.currentNumber = number;
                        this.updateCurrentBall(number);
                        this.updateNumbersGrid(number);
                        this.updateCalledCount();

                        if (this.config.autoMark) {
                            this.autoMarkNumber(number);
                        }
                    }
                }
                break;

            case 'chat_message':
                // Recibir mensaje de chat
                if (this.chat.enabled) {
                    this.displayChatMessage(data.data);

                    // Si es el host, rebroadcast a todos los demás
                    if (this.multiplayer.isHost) {
                        this.broadcastToPlayers(
                            {
                                type: 'chat_message',
                                data: data.data,
                            },
                            data.from
                        ); // Excluir al remitente original
                    }
                }
                break;

            case 'game_state':
                if (!this.multiplayer.isHost) {
                    // Sincronizar estado del juego
                    this.gameState.calledNumbers = data.data.calledNumbers || [];
                    this.gameState.currentNumber = data.data.currentNumber;
                    this.gameState.isPlaying = data.data.isPlaying;
                    this.config.gameMode = data.data.gameMode;

                    // Sincronizar velocidad del anfitrión
                    if (data.data.drawSpeed) {
                        this.config.drawSpeed = data.data.drawSpeed;
                        console.log(
                            `Velocidad sincronizada con el anfitrión: ${this.config.drawSpeed}ms`
                        );
                    }

                    // Sincronizar chat
                    if (data.data.chatEnabled !== undefined) {
                        this.chat.enabled = data.data.chatEnabled;
                        const chatPanel = document.getElementById('chatPanel');
                        const enableChatCheckbox = document.getElementById('enableChat');
                        if (chatPanel) {
                            chatPanel.style.display = data.data.chatEnabled ? 'block' : 'none';
                        }
                        if (enableChatCheckbox) {
                            enableChatCheckbox.checked = data.data.chatEnabled;
                        }
                        if (data.data.chatEnabled) {
                            this.addSystemMessage('Chat habilitado por el anfitrión');
                        }
                    }

                    // Sincronizar configuración corporativa
                    if (data.data.corporate) {
                        this.corporate = data.data.corporate;
                        this.updateCorporateBanner();

                        // Actualizar el preview del logo si existe
                        if (this.corporate.logoUrl) {
                            const preview = document.getElementById('logoPreview');
                            const previewImg = document.getElementById('logoPreviewImg');
                            if (preview && previewImg) {
                                previewImg.src = this.corporate.logoUrl;
                                preview.style.display = 'block';
                            }
                        }

                        // Actualizar los inputs de configuración corporativa
                        const companyNameInput = document.getElementById('companyName');
                        if (companyNameInput && this.corporate.companyName) {
                            companyNameInput.value = this.corporate.companyName;
                        }

                        const companyNitInput = document.getElementById('companyNit');
                        if (companyNitInput && this.corporate.nit) {
                            companyNitInput.value = this.corporate.nit;
                        }

                        const companyAddressInput = document.getElementById('companyAddress');
                        if (companyAddressInput && this.corporate.address) {
                            companyAddressInput.value = this.corporate.address;
                        }
                    }

                    // Sincronizar número de cartón
                    if (data.data.nextCardNumber) {
                        this.multiplayer.nextCardNumber = data.data.nextCardNumber;
                    }

                    // Auto-generar cartones si el jugador aún no los tiene
                    if (this.gameState.cards.length === 0 && this.config.numCards > 0) {
                        const assignedCards = [];
                        for (let i = 0; i < this.config.numCards; i++) {
                            const cardNumber = this.multiplayer.nextCardNumber++;
                            this.gameState.cards.push(this.generateBingoCard(cardNumber));
                            assignedCards.push(cardNumber);
                        }

                        // Notificar al anfitrión los cartones asignados
                        if (this.multiplayer.connections.has('host')) {
                            this.multiplayer.connections.get('host').send({
                                type: 'cards_assigned',
                                data: {
                                    playerId: this.multiplayer.peerId,
                                    cards: assignedCards,
                                },
                            });
                        }

                        // Guardar sesión en localStorage
                        const sessionData = {
                            sessionId: Date.now(),
                            cards: assignedCards,
                            playerName: this.config.playerName,
                            timestamp: Date.now(),
                        };
                        localStorage.setItem(
                            `session_${this.multiplayer.roomCode}`,
                            JSON.stringify(sessionData)
                        );

                        // Renderizar cartones
                        this.renderBingoCards();
                    }

                    // Actualizar UI
                    if (this.gameState.currentNumber) {
                        this.updateCurrentBall(this.gameState.currentNumber);
                    }
                    this.gameState.calledNumbers.forEach(num => {
                        this.updateNumbersGrid(num);
                    });
                    this.updateCalledCount();
                    this.updateObjectiveText();

                    // Marcar números en cartones
                    if (this.config.autoMark) {
                        this.gameState.calledNumbers.forEach(num => {
                            this.autoMarkNumber(num);
                        });
                    }
                }
                break;

            case 'player_list':
                // Actualizar lista de jugadores con toda la información
                data.data.forEach(player => {
                    // Actualizar o agregar jugador con toda su información
                    this.multiplayer.players.set(player.id, player);
                });
                this.updatePlayersUI();
                break;

            case 'winner_announced':
                // Marcar que ya hay un ganador
                this.gameState.hasWinner = true;

                // Agregar el ganador a la lista si no es el propio
                if (
                    !this.gameState.winners.find(
                        w => w.cardId === data.data.cardId && w.playerName === data.data.playerName
                    )
                ) {
                    this.gameState.winners.push(data.data);
                }

                // Mostrar ganador en TODOS los clientes (incluyendo el ganador)
                this.showWinnerModal(data.data);
                this.addToWinnersList(data.data);

                // Detener auto-sorteo en todos los clientes si está activo
                if (this.gameState.autoPlay) {
                    this.toggleAutoDraw();
                }
                break;

            case 'sync_card_counter':
                // Sincronizar contador de cartones
                if (!this.multiplayer.isHost && data.data.nextCardNumber) {
                    this.multiplayer.nextCardNumber = data.data.nextCardNumber;
                }
                break;

            case 'chat_toggle':
                // Sincronizar estado del chat
                if (!this.multiplayer.isHost) {
                    this.chat.enabled = data.data.enabled;
                    const chatPanel = document.getElementById('chatPanel');
                    const enableChatCheckbox = document.getElementById('enableChat');

                    if (chatPanel) {
                        chatPanel.style.display = data.data.enabled ? 'block' : 'none';
                    }
                    if (enableChatCheckbox) {
                        enableChatCheckbox.checked = data.data.enabled;
                    }

                    if (data.data.enabled) {
                        this.addSystemMessage('Chat habilitado por el anfitrión');
                    } else {
                        this.addSystemMessage('Chat deshabilitado por el anfitrión');
                    }
                }
                break;

            case 'corporate_update':
                // Sincronizar configuración corporativa
                if (!this.multiplayer.isHost && data.data.corporate) {
                    this.corporate = data.data.corporate;
                    this.updateCorporateBanner();
                }
                break;

            case 'cards_assigned':
                // Recibir información de cartones asignados (solo anfitrión)
                if (this.multiplayer.isHost && data.data.playerId) {
                    const player = this.multiplayer.players.get(data.data.playerId);
                    if (player) {
                        player.cards = data.data.cards;
                        this.multiplayer.players.set(data.data.playerId, player);

                        // Actualizar el contador nextCardNumber del anfitrión
                        // para que el próximo jugador reciba números únicos
                        const maxCardNumber = Math.max(...data.data.cards);
                        if (maxCardNumber >= this.multiplayer.nextCardNumber) {
                            this.multiplayer.nextCardNumber = maxCardNumber + 1;
                        }

                        this.updatePlayersUI();

                        // Broadcast la lista actualizada de jugadores a todos
                        this.broadcastToPlayers({
                            type: 'player_list',
                            data: Array.from(this.multiplayer.players.values()),
                        });
                    }
                }
                break;
        }
    }

    broadcastToPlayers(message, excludePeerId = null) {
        if (this.multiplayer.isHost) {
            this.multiplayer.connections.forEach((conn, peerId) => {
                if (conn.open && peerId !== excludePeerId) {
                    conn.send(message);
                }
            });
        }
    }

    updateConnectionUI(status) {
        const statusEl = document.getElementById('connectionStatus');
        const textEl = document.getElementById('connectionText');
        const playersEl = document.getElementById('playersCount');

        statusEl.style.display = 'flex';
        statusEl.className = 'connection-status';

        if (status === 'host') {
            statusEl.classList.add('host');
            textEl.textContent = 'Anfitrión';
            playersEl.style.display = 'inline';
        } else if (status === 'connected') {
            statusEl.classList.add('connected');
            textEl.textContent = 'Conectado';
            playersEl.style.display = 'none';
        } else {
            textEl.textContent = 'Desconectado';
            playersEl.style.display = 'none';
        }
    }

    updateUserNameDisplay() {
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('currentUserName');

        if (userInfo && userName) {
            userName.textContent = this.config.playerName;
            userInfo.style.display = 'flex';
        }
    }

    updatePlayersUI() {
        const playersList = document.getElementById('playersList');
        const playersCount = document.getElementById('playersCountList');
        const headerPlayersCount = document.getElementById('playersCount');

        const count = this.multiplayer.players.size;
        playersCount.textContent = count;

        if (headerPlayersCount) {
            headerPlayersCount.querySelector('i').nextSibling.textContent = ` ${count}`;
            headerPlayersCount.style.display = 'inline';
        }

        if (count === 0) {
            playersList.innerHTML =
                '<li style="color: var(--text-secondary);"><i class="fas fa-clock"></i> Esperando jugadores...</li>';
        } else {
            playersList.innerHTML = '';
            this.multiplayer.players.forEach(player => {
                const li = document.createElement('li');
                li.style.cssText =
                    'padding: 0.75rem; margin-bottom: 0.5rem; background: var(--bg-tertiary); border-radius: var(--border-radius-sm); border-left: 3px solid var(--primary-color);';

                // Icono y nombre
                const playerIcon = player.isHost
                    ? 'fa-crown'
                    : player.disconnected
                    ? 'fa-user-slash'
                    : 'fa-user';
                const playerName = player.disconnected
                    ? `<strong style="opacity: 0.5;">${player.name}</strong> <span style="color: #ef4444; font-size: 0.75rem;">(Desconectado)</span>`
                    : `<strong>${player.name}</strong>`;
                const hostBadge = player.isHost
                    ? '<span style="background: var(--accent-color); color: white; padding: 0.15rem 0.5rem; border-radius: 12px; font-size: 0.75rem; margin-left: 0.5rem;">ANFITRIÓN</span>'
                    : '';

                // Información de cartones
                let cartonesInfo = '';
                if (player.cards && player.cards.length > 0) {
                    const cartonesHTML = player.cards
                        .map(
                            c =>
                                `<span style="background: var(--success-color); color: white; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">#${c}</span>`
                        )
                        .join(' ');
                    cartonesInfo = `<div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                        <i class="fas fa-ticket-alt" style="color: var(--primary-color); font-size: 0.9rem;"></i>
                        <span style="color: var(--text-secondary); font-size: 0.85rem;">Cartones:</span>
                        ${cartonesHTML}
                    </div>`;
                } else if (player.numCards) {
                    cartonesInfo = `<div style="margin-top: 0.5rem;">
                        <i class="fas fa-ticket-alt" style="color: var(--text-secondary); font-size: 0.85rem;"></i>
                        <small style="color: var(--text-secondary);"> ${player.numCards} cartón${
                        player.numCards > 1 ? 'es' : ''
                    } (sin asignar)</small>
                    </div>`;
                }

                li.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <i class="fas ${playerIcon}" style="color: ${
                    player.isHost ? 'var(--accent-color)' : 'var(--primary-color)'
                }; margin-right: 0.5rem;"></i>
                        ${playerName}
                        ${hostBadge}
                    </div>
                    ${cartonesInfo}
                `;
                playersList.appendChild(li);
            });
        }
    }

    updateRoomUI() {
        const roomTypeEl = document.getElementById('roomType');
        const roomCodeDisplay = document.getElementById('roomCodeDisplay');
        const roomCodeEl = document.getElementById('roomCode');
        const copyBtn = document.getElementById('copyRoomCode');
        const hostNote = document.getElementById('hostNote');

        if (this.multiplayer.isHost) {
            roomTypeEl.textContent = 'Multijugador - Anfitrión';
            roomCodeDisplay.style.display = 'block';
            roomCodeEl.textContent = this.multiplayer.roomCode;
            copyBtn.style.display = 'inline-flex';
            hostNote.style.display = 'block';
        } else if (this.multiplayer.enabled) {
            roomTypeEl.textContent = 'Multijugador - Jugador';
            roomCodeDisplay.style.display = 'block';
            roomCodeEl.textContent = this.multiplayer.roomCode;
            copyBtn.style.display = 'none';
            hostNote.style.display = 'none';
        } else {
            roomTypeEl.textContent = 'Local';
            roomCodeDisplay.style.display = 'none';
            copyBtn.style.display = 'none';
            hostNote.style.display = 'none';
        }
    }

    copyRoomCodeToClipboard() {
        const code = this.multiplayer.roomCode;
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('copyRoomCode');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    }

    // ===== GENERACIÓN DE CARTONES =====
    generateBingoCard(cardNumber) {
        const card = {
            id: cardNumber,
            numbers: this.generateCardNumbers(),
            marked: Array(25).fill(false),
            progress: 0,
        };
        card.marked[12] = true; // FREE space
        return card;
    }

    generateCardNumbers() {
        const numbers = [];
        const ranges = [
            [1, 15], // B
            [16, 30], // I
            [31, 45], // N
            [46, 60], // G
            [61, 75], // O
        ];

        for (let col = 0; col < 5; col++) {
            const colNumbers = [];
            const [min, max] = ranges[col];

            while (colNumbers.length < 5) {
                const num = Math.floor(Math.random() * (max - min + 1)) + min;
                if (!colNumbers.includes(num)) {
                    colNumbers.push(num);
                }
            }

            colNumbers.sort((a, b) => a - b);
            numbers.push(...colNumbers);
        }

        return numbers;
    }

    renderCards() {
        const container = document.getElementById('cardsGrid');
        container.innerHTML = '';

        this.gameState.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            container.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'bingo-card';
        cardDiv.dataset.cardId = card.id;

        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-title">BINGO</div>
                <div class="card-number">Cartón #${card.id}</div>
            </div>
            <div class="bingo-grid">
                ${this.createGridHTML(card)}
            </div>
            <div class="card-progress">
                <div class="progress-bar" style="width: ${card.progress}%"></div>
            </div>
            <div class="card-stats">
                <span><i class="fas fa-check-circle"></i> ${this.countMarked(card)}/24</span>
                <span><i class="fas fa-percentage"></i> ${Math.round(card.progress)}%</span>
            </div>
        `;

        return cardDiv;
    }

    createGridHTML(card) {
        const letters = ['B', 'I', 'N', 'G', 'O'];
        let html = '';

        // Headers
        letters.forEach(letter => {
            html += `<div class="bingo-cell header">${letter}</div>`;
        });

        // Numbers
        for (let i = 0; i < 25; i++) {
            const num = card.numbers[i];
            const isFree = i === 12;
            const isMarked = card.marked[i];

            let cellClass = 'bingo-cell';
            if (isFree) cellClass += ' free';
            if (isMarked) cellClass += ' marked';

            const cellContent = isFree ? 'FREE' : num;

            html += `<div class="${cellClass}" data-card="${card.id}" data-index="${i}" onclick="bingoApp.toggleCell(${card.id}, ${i})">
                ${cellContent}
            </div>`;
        }

        return html;
    }

    toggleCell(cardId, index) {
        if (index === 12) return; // FREE space

        const card = this.gameState.cards.find(c => c.id === cardId);
        if (!card) return;

        const number = card.numbers[index];

        // Solo permitir marcar si el número ha sido llamado o si no hay auto-mark
        if (!this.config.autoMark || this.gameState.calledNumbers.includes(number)) {
            card.marked[index] = !card.marked[index];
            this.updateCardProgress(card);
            this.renderCards();

            if (card.marked[index]) {
                this.checkWin(card);
            }
        }
    }

    // ===== SORTEO DE NÚMEROS =====
    drawNumber() {
        if (!this.gameState.isPlaying || this.gameState.isPaused) return;

        // Solo el anfitrión puede sortear en modo multijugador
        if (this.multiplayer.enabled && !this.multiplayer.isHost) {
            alert('Solo el anfitrión puede sortear números');
            return;
        }

        if (this.gameState.calledNumbers.length >= 75) {
            this.endGame('No hay más números para sortear');
            return;
        }

        let number;
        do {
            number = Math.floor(Math.random() * 75) + 1;
        } while (this.gameState.calledNumbers.includes(number));

        this.gameState.calledNumbers.push(number);
        this.gameState.currentNumber = number;

        // Actualizar UI
        this.updateCurrentBall(number);
        this.updateNumbersGrid(number);
        this.updateCalledCount();

        // Actualizar estadísticas
        this.stats.numberFrequency[number] = (this.stats.numberFrequency[number] || 0) + 1;

        // Auto-marcar en cartones
        if (this.config.autoMark) {
            this.autoMarkNumber(number);
        }

        // Reproducir sonido
        if (this.config.soundEnabled) {
            this.playSound('draw');
            // Anunciar el número con síntesis de voz
            this.announceNumber(number);
        }

        // Broadcast en modo multijugador
        if (this.multiplayer.enabled && this.multiplayer.isHost) {
            this.broadcastToPlayers({
                type: 'number_drawn',
                data: { number: number },
            });
        }
    }

    updateCurrentBall(number) {
        const ball = document.getElementById('currentNumber');
        ball.textContent = number;
        ball.parentElement.classList.add('pulse');
        setTimeout(() => ball.parentElement.classList.remove('pulse'), 500);
    }

    autoMarkNumber(number) {
        this.gameState.cards.forEach(card => {
            const index = card.numbers.indexOf(number);
            if (index !== -1 && !card.marked[index]) {
                card.marked[index] = true;
                this.updateCardProgress(card);
                this.checkWin(card);
            }
        });
        this.renderCards();
    }

    updateCardProgress(card) {
        const marked = this.countMarked(card);
        card.progress = (marked / 24) * 100;
    }

    countMarked(card) {
        return card.marked.filter((m, i) => m && i !== 12).length;
    }

    // ===== VALIDACIÓN DE PREMIOS =====
    checkWin(card) {
        // Si ya hay un ganador, no verificar más
        if (this.gameState.hasWinner) {
            return;
        }

        const mode = this.config.gameMode;
        let won = false;
        let winType = '';

        switch (mode) {
            case 'classic':
                won = this.checkFullCard(card);
                winType = 'Cartón Completo';
                break;
            case 'line':
                won = this.checkLine(card);
                winType = 'Línea';
                break;
            case 'corners':
                won = this.checkCorners(card);
                winType = '4 Esquinas';
                break;
            case 'blackout':
                won = this.checkFullCard(card);
                winType = 'Apagón Total';
                break;
        }

        if (won && !this.gameState.winners.find(w => w.cardId === card.id)) {
            this.declareWinner(card, winType);
        }
    }

    checkFullCard(card) {
        return card.marked.every(m => m);
    }

    checkLine(card) {
        // Verificar filas
        for (let row = 0; row < 5; row++) {
            const start = row * 5 + 5; // +5 para saltar headers
            let complete = true;
            for (let col = 0; col < 5; col++) {
                if (!card.marked[row * 5 + col]) {
                    complete = false;
                    break;
                }
            }
            if (complete) return true;
        }

        // Verificar columnas
        for (let col = 0; col < 5; col++) {
            let complete = true;
            for (let row = 0; row < 5; row++) {
                if (!card.marked[row * 5 + col]) {
                    complete = false;
                    break;
                }
            }
            if (complete) return true;
        }

        // Verificar diagonales
        const diag1 = [0, 6, 12, 18, 24];
        const diag2 = [4, 8, 12, 16, 20];

        if (diag1.every(i => card.marked[i])) return true;
        if (diag2.every(i => card.marked[i])) return true;

        return false;
    }

    checkCorners(card) {
        const corners = [0, 4, 20, 24];
        return corners.every(i => card.marked[i]);
    }

    declareWinner(card, winType) {
        // Verificar nuevamente que no haya ganador (por race conditions)
        if (this.gameState.hasWinner) {
            return;
        }

        // Marcar que ya hay un ganador
        this.gameState.hasWinner = true;

        const winner = {
            cardId: card.id,
            playerName: this.config.playerName,
            winType: winType,
            numbers: this.gameState.calledNumbers.length,
            time: this.gameState.gameTime,
        };

        this.gameState.winners.push(winner);
        this.stats.bingosWon++;
        this.saveStats();

        // Detener auto-sorteo automáticamente cuando hay ganador
        if (this.gameState.autoPlay) {
            this.toggleAutoDraw();
        }

        // Marcar cartón como ganador
        const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
        if (cardElement) {
            cardElement.classList.add('winner');
        }

        // Mostrar modal de ganador
        this.showWinnerModal(winner);

        // Reproducir sonido
        if (this.config.soundEnabled) {
            this.playSound('win');
        }

        // Agregar a lista de ganadores
        this.addToWinnersList(winner);

        // Broadcast ganador en modo multijugador
        if (this.multiplayer.enabled) {
            const message = {
                type: 'winner_announced',
                data: winner,
            };

            if (this.multiplayer.isHost) {
                this.broadcastToPlayers(message);
            } else {
                // Enviar al anfitrión
                const hostConn = this.multiplayer.connections.get('host');
                if (hostConn && hostConn.open) {
                    hostConn.send(message);
                }
            }
        }
    }

    showWinnerModal(winner) {
        const modal = document.getElementById('winnerModal');
        const winnerNameEl = document.getElementById('winnerName');
        const winnerDetailsEl = document.getElementById('winnerDetails');
        const continueBtn = document.getElementById('continueGame');

        winnerNameEl.textContent = winner.playerName;

        // Mensaje mejorado con más detalles
        let mensaje = '';
        let premio = null;

        if (winner.winType === 'Primera Línea') {
            mensaje = '🎉 ¡Completó la Primera Línea!';
            premio = this.prizes.firstLine;
        } else if (winner.winType === 'Segunda Línea') {
            mensaje = '🎊 ¡Completó la Segunda Línea!';
            premio = this.prizes.secondLine;
        } else if (winner.winType === 'Bingo') {
            mensaje = '🏆 ¡BINGO COMPLETO!';
            premio = this.prizes.bingo;
        } else {
            mensaje = `✨ ¡${winner.winType}!`;
        }

        // Formatear el premio
        let premioTexto = '';
        if (premio) {
            if (premio.type === 'money') {
                premioTexto = `<div style="font-size: 1.5rem; color: #10b981; font-weight: bold; margin: 0.8rem 0;">
                    💰 Premio: $${premio.value.toLocaleString('es-CO')} ${this.prizes.currency}
                </div>`;
            } else {
                premioTexto = `<div style="font-size: 1.3rem; color: #10b981; font-weight: bold; margin: 0.8rem 0;">
                    🎁 Premio: ${premio.value}
                </div>`;
            }
        }

        winnerDetailsEl.innerHTML = `
            <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">${mensaje}</div>
            ${premioTexto}
            <div>Cartón #${winner.cardId}</div>
            <div>${winner.numbers} números sorteados</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">
                Tiempo: ${this.formatTime(winner.time)}
            </div>
        `;

        // Mostrar/ocultar botón de continuar según el rol
        if (this.multiplayer.isHost) {
            continueBtn.style.display = 'block';
            continueBtn.textContent = 'Continuar Juego';
        } else {
            continueBtn.style.display = 'block';
            continueBtn.textContent = 'Cerrar';
        }

        modal.classList.add('active');
        this.createConfetti();

        // Reproducir sonido extra para destacar
        if (this.config.soundEnabled) {
            setTimeout(() => this.playSound('win'), 300);
        }
    }

    closeWinnerModal() {
        const modal = document.getElementById('winnerModal');
        modal.classList.remove('active');

        // Si es el anfitrión y el juego sigue activo, puede continuar
        if (this.multiplayer.isHost && this.gameState.isPlaying) {
            // El anfitrión puede decidir continuar o reiniciar
            // Por ahora, solo cerramos el modal
        }
    }

    addToWinnersList(winner) {
        const list = document.getElementById('winnersList');

        if (list.querySelector('.empty-state')) {
            list.innerHTML = '';
        }

        const item = document.createElement('div');
        item.className = 'winner-item';
        item.innerHTML = `
            <strong>${winner.playerName}</strong><br>
            ${winner.winType} - Cartón #${winner.cardId}<br>
            <small>${winner.numbers} números en ${this.formatTime(winner.time)}</small>
        `;
        list.insertBefore(item, list.firstChild);
    }

    createConfetti() {
        const confetti = document.querySelector('.confetti');
        confetti.innerHTML = '';

        const colors = [
            '#6366f1',
            '#ec4899',
            '#f59e0b',
            '#10b981',
            '#3b82f6',
            '#8b5cf6',
            '#ef4444',
        ];

        // Aumentar la cantidad de confetti para un efecto más impresionante
        for (let i = 0; i < 150; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'absolute';

            // Variar el tamaño de las piezas
            const size = 8 + Math.random() * 12;
            piece.style.width = size + 'px';
            piece.style.height = size + 'px';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = -20 + 'px';
            piece.style.opacity = 0.7 + Math.random() * 0.3;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';

            // Rotación inicial
            const initialRotation = Math.random() * 360;
            piece.style.transform = `rotate(${initialRotation}deg)`;

            confetti.appendChild(piece);

            // Animar con más variedad
            const duration = 3000 + Math.random() * 2000;
            const delay = Math.random() * 800;
            const horizontalMovement = Math.random() * 60 - 30; // -30 a +30
            const rotationSpeed = Math.random() * 720 - 360; // -360 a +360

            setTimeout(() => {
                piece.style.transition = `top ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                                         left ${duration}ms ease-in-out, 
                                         transform ${duration}ms linear, 
                                         opacity ${duration}ms linear`;
                piece.style.top = '120%';
                piece.style.left = parseFloat(piece.style.left) + horizontalMovement + '%';
                piece.style.transform = `rotate(${initialRotation + rotationSpeed}deg)`;
                piece.style.opacity = '0';
            }, delay);
        }
    }

    checkAllCards() {
        this.gameState.cards.forEach(card => this.checkWin(card));
    }

    // ===== CONTROL DEL JUEGO =====
    startNewGame() {
        // Obtener configuración
        this.config.playerName = document.getElementById('playerName').value || 'Jugador 1';
        this.config.numCards = parseInt(document.getElementById('numCards').value);
        this.config.gameMode = document.getElementById('gameMode').value;
        this.config.autoMark = document.getElementById('autoMark').checked;
        this.config.drawSpeed = parseInt(document.getElementById('drawSpeed').value);

        // Mostrar nombre del usuario en el header
        this.updateUserNameDisplay();

        const gameType = document.getElementById('gameType').value;

        // Inicializar multijugador si corresponde
        if (gameType === 'host') {
            this.initializeMultiplayer('host');
        } else if (gameType === 'join') {
            const joinCode = document.getElementById('joinCode').value.trim();
            if (!joinCode) {
                alert('Debes ingresar un código de sala');
                return;
            }
            this.initializeMultiplayer('join', joinCode);
        }

        // Cerrar modal de configuración
        document.getElementById('setupModal').classList.remove('active');

        // Solo generar cartones si NO es modo multijugador join
        // Los jugadores que se unen esperarán a recibir game_state para generar cartones
        if (gameType === 'join') {
            // No generar cartones todavía, esperar a recibir game_state del anfitrión
            return;
        }

        // Generar cartones (solo para host o modo individual)
        this.gameState.cards = [];
        const assignedCards = []; // Para tracking de números asignados
        for (let i = 0; i < this.config.numCards; i++) {
            const cardNumber = this.multiplayer.enabled ? this.multiplayer.nextCardNumber++ : i + 1;
            this.gameState.cards.push(this.generateBingoCard(cardNumber));
            assignedCards.push(cardNumber);
        }

        // Si es modo multijugador, actualizar información del jugador con cartones
        if (this.multiplayer.enabled) {
            const myPlayerId = this.multiplayer.isHost ? 'host' : this.multiplayer.peerId;
            if (this.multiplayer.players.has(myPlayerId)) {
                const player = this.multiplayer.players.get(myPlayerId);
                player.cards = assignedCards;
                this.multiplayer.players.set(myPlayerId, player);
            }

            // Si es anfitrión, sincronizar el contador y actualizar sus propios cartones
            if (this.multiplayer.isHost) {
                this.broadcastToPlayers({
                    type: 'sync_card_counter',
                    data: { nextCardNumber: this.multiplayer.nextCardNumber },
                });

                // Actualizar cartones del anfitrión
                const hostPlayer = this.multiplayer.players.get('host');
                if (hostPlayer) {
                    hostPlayer.cards = assignedCards;
                    this.updatePlayersUI();

                    // Broadcast la lista actualizada de jugadores
                    this.broadcastToPlayers({
                        type: 'player_list',
                        data: Array.from(this.multiplayer.players.values()),
                    });
                }
            }

            // Si es jugador, notificar al anfitrión los cartones asignados
            if (!this.multiplayer.isHost && this.multiplayer.connections.has('host')) {
                this.multiplayer.connections.get('host').send({
                    type: 'cards_assigned',
                    data: {
                        playerId: this.multiplayer.peerId,
                        cards: assignedCards,
                    },
                });
            }
        }

        // Inicializar juego
        this.gameState.isPlaying = true;
        this.gameState.calledNumbers = [];
        this.gameState.currentNumber = null;
        this.gameState.winners = [];
        this.gameState.hasWinner = false;
        this.gameState.startTime = Date.now();

        // Render
        this.renderCards();
        this.updateObjectiveText();
        this.startTimer();
        this.updateRoomUI();
        this.updatePlayersUI();

        // Actualizar estadísticas
        this.stats.gamesPlayed++;
        this.saveStats();
        this.updateStatsDisplay();

        // Deshabilitar controles si no es anfitrión en multijugador
        if (this.multiplayer.enabled && !this.multiplayer.isHost) {
            // Ocultar botones de control del juego
            const drawBallBtn = document.getElementById('drawBall');
            const autoDrawBtn = document.getElementById('autoDraw');
            const newGameBtn = document.getElementById('newGame');

            if (drawBallBtn) drawBallBtn.style.display = 'none';
            if (autoDrawBtn) autoDrawBtn.style.display = 'none';
            if (newGameBtn) newGameBtn.style.display = 'none';
        } else {
            // Asegurar que los botones estén visibles para el anfitrión
            const drawBallBtn = document.getElementById('drawBall');
            const autoDrawBtn = document.getElementById('autoDraw');
            const newGameBtn = document.getElementById('newGame');

            if (drawBallBtn) drawBallBtn.style.display = 'inline-flex';
            if (autoDrawBtn) autoDrawBtn.style.display = 'inline-flex';
            if (newGameBtn) newGameBtn.style.display = 'inline-flex';
        }
    }

    toggleAutoDraw() {
        // Solo el anfitrión puede usar auto-sorteo en multijugador
        if (this.multiplayer.enabled && !this.multiplayer.isHost) {
            alert('Solo el anfitrión puede controlar el sorteo automático');
            return;
        }

        this.gameState.autoPlay = !this.gameState.autoPlay;
        const btn = document.getElementById('autoDraw');
        const pauseBtn = document.getElementById('pauseGame');

        if (this.gameState.autoPlay) {
            btn.innerHTML = '<i class="fas fa-stop"></i> Detener Auto';
            btn.classList.add('btn-danger');
            pauseBtn.style.display = 'inline-flex';

            this.gameState.autoDrawInterval = setInterval(() => {
                if (!this.gameState.isPaused) {
                    this.drawNumber();
                }
            }, this.config.drawSpeed);
        } else {
            btn.innerHTML = '<i class="fas fa-sync"></i> Auto Sorteo';
            btn.classList.remove('btn-danger');
            pauseBtn.style.display = 'none';

            if (this.gameState.autoDrawInterval) {
                clearInterval(this.gameState.autoDrawInterval);
            }
        }
    }

    pauseGame() {
        this.gameState.isPaused = !this.gameState.isPaused;
        const btn = document.getElementById('pauseGame');

        if (this.gameState.isPaused) {
            btn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        } else {
            btn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        }
    }

    resetGame() {
        if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
            // Limpiar intervalos
            if (this.gameState.autoDrawInterval) {
                clearInterval(this.gameState.autoDrawInterval);
            }
            if (this.gameState.timerInterval) {
                clearInterval(this.gameState.timerInterval);
            }

            // Reset estado
            this.gameState.isPlaying = false;
            this.gameState.autoPlay = false;
            this.gameState.isPaused = false;

            // Mostrar modal de configuración
            document.getElementById('setupModal').classList.add('active');

            // Reset UI
            document.getElementById('currentNumber').textContent = '-';
            document.getElementById('calledCount').textContent = '0';
            document.getElementById('gameTime').textContent = '00:00';
            this.generateNumbersGrid();
        }
    }

    endGame(message) {
        if (this.gameState.autoDrawInterval) {
            clearInterval(this.gameState.autoDrawInterval);
        }
        alert(message);
    }

    // ===== TIMER =====
    startTimer() {
        this.gameState.timerInterval = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.gameState.gameTime = Math.floor(
                    (Date.now() - this.gameState.startTime) / 1000
                );
                document.getElementById('gameTime').textContent = this.formatTime(
                    this.gameState.gameTime
                );
            }
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // ===== NÚMEROS GRID =====
    generateNumbersGrid() {
        const grid = document.getElementById('numbersGrid');
        grid.innerHTML = '';

        for (let i = 1; i <= 75; i++) {
            const cell = document.createElement('div');
            cell.className = 'number-cell';
            cell.textContent = i;
            cell.dataset.number = i;
            grid.appendChild(cell);
        }
    }

    updateNumbersGrid(number) {
        const cell = document.querySelector(`.number-cell[data-number="${number}"]`);
        if (cell) {
            cell.classList.add('called', 'recent');
            setTimeout(() => cell.classList.remove('recent'), 500);
        }
    }

    updateCalledCount() {
        document.getElementById('calledCount').textContent = this.gameState.calledNumbers.length;
    }

    updateObjectiveText() {
        const objectives = {
            classic: 'Completa el cartón completo',
            line: 'Completa una línea (horizontal, vertical o diagonal)',
            corners: 'Marca las 4 esquinas',
            pattern: 'Completa el patrón especial',
            blackout: 'Marca todos los números del cartón',
        };
        document.getElementById('objectiveText').textContent = objectives[this.config.gameMode];

        // Actualizar visualización del modo de juego
        this.updateGameModeDisplay();
    }

    updateGameModeDisplay() {
        const panel = document.getElementById('currentGameModePanel');
        const titleEl = document.getElementById('currentModeTitle');
        const descEl = document.getElementById('currentModeDescription');
        const instructionEl = document.getElementById('currentModeInstruction');
        const patternGrid = document.getElementById('patternGrid');

        if (!panel || !this.gameState.isPlaying) {
            if (panel) panel.style.display = 'none';
            return;
        }

        panel.style.display = 'block';

        const modeInfo = {
            classic: {
                title: '🎯 Clásico',
                description: 'Cartón completo',
                instruction: 'Marca todos los 24 números del cartón',
                pattern: Array(25).fill(true), // Todos activos excepto centro
            },
            line: {
                title: '📏 Línea',
                description: 'Una línea completa',
                instruction: 'Completa una línea horizontal, vertical o diagonal',
                pattern: this.getLinePattern(),
            },
            corners: {
                title: '📐 4 Esquinas',
                description: 'Las cuatro esquinas',
                instruction: 'Marca las 4 esquinas del cartón',
                pattern: this.getCornersPattern(),
            },
            pattern: {
                title: '✨ Patrón Especial',
                description: 'Patrón personalizado',
                instruction: 'Completa el patrón mostrado',
                pattern: Array(25).fill(false),
            },
            blackout: {
                title: '🌑 Apagón Total',
                description: 'Todo el cartón',
                instruction: 'Marca absolutamente todos los números',
                pattern: Array(25).fill(true),
            },
        };

        const mode = modeInfo[this.config.gameMode] || modeInfo.classic;

        titleEl.textContent = mode.title;
        descEl.textContent = mode.description;
        instructionEl.innerHTML = `<i class="fas fa-info-circle"></i><span>${mode.instruction}</span>`;

        // Generar grid visual
        patternGrid.innerHTML = '';
        mode.pattern.forEach((isActive, index) => {
            const cell = document.createElement('div');
            cell.className = 'pattern-cell';

            if (index === 12) {
                cell.classList.add('free');
                cell.textContent = '★';
            } else if (isActive) {
                cell.classList.add('active');
                cell.textContent = '✓';
            } else {
                cell.textContent = '';
            }

            patternGrid.appendChild(cell);
        });
    }

    getLinePattern() {
        // Mostrar ejemplo de línea horizontal superior
        const pattern = Array(25).fill(false);
        for (let i = 0; i < 5; i++) {
            pattern[i] = true;
        }
        pattern[12] = false; // Centro siempre libre
        return pattern;
    }

    getCornersPattern() {
        const pattern = Array(25).fill(false);
        pattern[0] = true; // Superior izquierda
        pattern[4] = true; // Superior derecha
        pattern[20] = true; // Inferior izquierda
        pattern[24] = true; // Inferior derecha
        return pattern;
    }

    // ===== PANEL DE ADMINISTRADOR =====
    openAdminPanel() {
        document.getElementById('adminModal').classList.add('active');
        this.updateRoomUI();
        this.updatePlayersUI();
        this.updateStatsDisplay();
        this.updateAdminPermissions(); // Restringir acceso según rol
    }

    closeAdminPanel() {
        document.getElementById('adminModal').classList.remove('active');
    }

    updateAdminPermissions() {
        const isHost = this.multiplayer.isHost || !this.multiplayer.enabled;

        // Tabs que solo el anfitrión puede acceder
        const prizesTab = document.querySelector('.tab-btn[data-tab="prizes"]');
        const settingsTab = document.querySelector('.tab-btn[data-tab="settings"]');

        if (!isHost) {
            // Deshabilitar tabs para jugadores
            if (prizesTab) {
                prizesTab.disabled = true;
                prizesTab.style.opacity = '0.5';
                prizesTab.style.cursor = 'not-allowed';
                prizesTab.title = 'Solo el anfitrión puede configurar premios';
            }
            if (settingsTab) {
                settingsTab.disabled = true;
                settingsTab.style.opacity = '0.5';
                settingsTab.style.cursor = 'not-allowed';
                settingsTab.title = 'Solo el anfitrión puede cambiar la configuración';
            }

            // Deshabilitar botones de guardado
            const savePrizesBtn = document.getElementById('savePrizes');
            const saveCorporateBtn = document.getElementById('saveCorporateSettings');
            const resetStatsBtn = document.getElementById('resetStats');

            if (savePrizesBtn) savePrizesBtn.disabled = true;
            if (saveCorporateBtn) saveCorporateBtn.disabled = true;
            if (resetStatsBtn) resetStatsBtn.disabled = true;

            // Deshabilitar inputs de premios
            [
                'prize1Type',
                'prize1Value',
                'prize2Type',
                'prize2Value',
                'prizeBingoType',
                'prizeBingoValue',
            ].forEach(id => {
                const element = document.getElementById(id);
                if (element) element.disabled = true;
            });

            // Deshabilitar configuración corporativa
            const companyName = document.getElementById('companyName');
            const companyLogo = document.getElementById('companyLogo');
            const colorTheme = document.getElementById('colorTheme');
            const showAnimations = document.getElementById('showAnimations');
            const enableChat = document.getElementById('enableChat');

            if (companyName) companyName.disabled = true;
            if (companyLogo) companyLogo.disabled = true;
            if (colorTheme) colorTheme.disabled = true;
            if (showAnimations) showAnimations.disabled = true;
            if (enableChat) enableChat.disabled = true;

            // Mostrar mensaje informativo en tabs restringidos
            const prizesContent = document.getElementById('prizesTab');
            const settingsContent = document.getElementById('settingsTab');

            if (prizesContent && !prizesContent.querySelector('.player-restriction-notice')) {
                const notice = document.createElement('div');
                notice.className = 'player-restriction-notice';
                notice.innerHTML =
                    '<i class="fas fa-lock"></i> <strong>Acceso Restringido:</strong> Solo el anfitrión puede modificar los premios.';
                prizesContent.insertBefore(notice, prizesContent.firstChild);
            }

            if (settingsContent && !settingsContent.querySelector('.player-restriction-notice')) {
                const notice = document.createElement('div');
                notice.className = 'player-restriction-notice';
                notice.innerHTML =
                    '<i class="fas fa-lock"></i> <strong>Acceso Restringido:</strong> Solo el anfitrión puede modificar la configuración.';
                settingsContent.insertBefore(notice, settingsContent.firstChild);
            }
        } else {
            // Habilitar todo para el anfitrión
            if (prizesTab) {
                prizesTab.disabled = false;
                prizesTab.style.opacity = '1';
                prizesTab.style.cursor = 'pointer';
                prizesTab.title = 'Premios';
            }
            if (settingsTab) {
                settingsTab.disabled = false;
                settingsTab.style.opacity = '1';
                settingsTab.style.cursor = 'pointer';
                settingsTab.title = 'Configuración';
            }
        }
    }

    updateRoomCode() {
        this.roomCode = this.generateRoomCode();
        document.getElementById('roomCode').textContent = this.roomCode;
    }

    switchTab(tabName) {
        const isHost = this.multiplayer.isHost || !this.multiplayer.enabled;

        // Verificar permisos antes de cambiar de tab
        if (!isHost && (tabName === 'prizes' || tabName === 'settings')) {
            alert('⚠️ Solo el anfitrión puede acceder a esta sección');
            return;
        }

        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    // ===== ESTADÍSTICAS =====
    updateStatsDisplay() {
        document.getElementById('gamesPlayed').textContent = this.stats.gamesPlayed;
        document.getElementById('bingosWon').textContent = this.stats.bingosWon;

        // Número más frecuente
        const mostFrequent = this.getMostFrequentNumber();
        document.getElementById('mostFrequent').textContent = mostFrequent || '-';

        // Tiempo promedio
        if (this.stats.gamesPlayed > 0) {
            const avgTime = Math.floor(this.stats.totalTime / this.stats.gamesPlayed);
            document.getElementById('avgTime').textContent = this.formatTime(avgTime);
        }
    }

    getMostFrequentNumber() {
        let maxCount = 0;
        let mostFrequent = null;

        for (const [num, count] of Object.entries(this.stats.numberFrequency)) {
            if (count > maxCount) {
                maxCount = count;
                mostFrequent = num;
            }
        }

        return mostFrequent;
    }

    saveStats() {
        localStorage.setItem('bingoStats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('bingoStats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    }

    resetStats() {
        if (confirm('¿Estás seguro de que quieres resetear todas las estadísticas?')) {
            this.stats = {
                gamesPlayed: 0,
                bingosWon: 0,
                numberFrequency: {},
                totalTime: 0,
            };
            this.saveStats();
            this.updateStatsDisplay();
        }
    }

    // ===== TEMAS =====
    toggleTheme() {
        this.config.darkTheme = !this.config.darkTheme;
        document.body.classList.toggle('dark-theme');

        const icon = document.querySelector('#themeToggle i');
        icon.className = this.config.darkTheme ? 'fas fa-sun' : 'fas fa-moon';

        localStorage.setItem('darkTheme', this.config.darkTheme);
    }

    changeColorTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove(
            'theme-ocean',
            'theme-sunset',
            'theme-forest',
            'theme-corporate'
        );

        if (theme !== 'default') {
            document.body.classList.add(`theme-${theme}`);
        }

        this.config.colorTheme = theme;
        localStorage.setItem('colorTheme', theme);
    }

    loadTheme() {
        const darkTheme = localStorage.getItem('darkTheme') === 'true';
        const colorTheme = localStorage.getItem('colorTheme') || 'default';

        if (darkTheme) {
            this.config.darkTheme = true;
            document.body.classList.add('dark-theme');
            document.querySelector('#themeToggle i').className = 'fas fa-sun';
        }

        if (colorTheme !== 'default') {
            this.changeColorTheme(colorTheme);
            document.getElementById('colorTheme').value = colorTheme;
        }
    }

    toggleSound() {
        this.config.soundEnabled = !this.config.soundEnabled;
        const icon = document.querySelector('#soundToggle i');
        icon.className = this.config.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }

    toggleAnimations(enabled) {
        this.config.showAnimations = enabled;
        document.body.classList.toggle('no-animations', !enabled);
    }

    // ===== ACCIONES ADICIONALES =====
    printCards() {
        window.print();
    }

    shareGame() {
        const shareText = `¡Únete a mi partida de Bingo!\nCódigo de sala: ${this.roomCode}`;

        if (navigator.share) {
            navigator.share({
                title: 'BingoEd - Partida de Bingo',
                text: shareText,
            });
        } else {
            // Copiar al portapapeles
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Código de sala copiado al portapapeles:\n' + this.roomCode);
            });
        }
    }

    // ===== GESTIÓN DE PREMIOS =====
    savePrizes() {
        const prize1Type = document.getElementById('prize1Type').value;
        const prize1Value = document.getElementById('prize1Value').value;
        const prize2Type = document.getElementById('prize2Type').value;
        const prize2Value = document.getElementById('prize2Value').value;
        const prizeBingoType = document.getElementById('prizeBingoType').value;
        const prizeBingoValue = document.getElementById('prizeBingoValue').value;

        this.prizes.firstLine = {
            type: prize1Type,
            value: prize1Type === 'money' ? this.parseMoneyValue(prize1Value) : prize1Value,
            description:
                prize1Type === 'money'
                    ? this.formatMoney(this.parseMoneyValue(prize1Value))
                    : prize1Value,
        };

        this.prizes.secondLine = {
            type: prize2Type,
            value: prize2Type === 'money' ? this.parseMoneyValue(prize2Value) : prize2Value,
            description:
                prize2Type === 'money'
                    ? this.formatMoney(this.parseMoneyValue(prize2Value))
                    : prize2Value,
        };

        this.prizes.bingo = {
            type: prizeBingoType,
            value:
                prizeBingoType === 'money'
                    ? this.parseMoneyValue(prizeBingoValue)
                    : prizeBingoValue,
            description:
                prizeBingoType === 'money'
                    ? this.formatMoney(this.parseMoneyValue(prizeBingoValue))
                    : prizeBingoValue,
        };

        localStorage.setItem('bingoPrizes', JSON.stringify(this.prizes));

        // Actualizar premios en la interfaz del juego
        this.updatePrizesDisplay();

        alert('✅ Premios guardados correctamente');
    }

    updatePrizeCurrency(prizeId, type) {
        const currencySpan = document.getElementById(`${prizeId}Currency`);
        const valueContainer = document.getElementById(`${prizeId}ValueContainer`);
        const currentValue = document.getElementById(`${prizeId}Value`).value;

        if (type === 'money') {
            currencySpan.textContent = 'COP';
            currencySpan.style.display = 'inline';

            // Crear input para dinero
            valueContainer.innerHTML = `
                <input type="text" id="${prizeId}Value" placeholder="Ej: 50000" 
                       value="${type === 'money' ? currentValue : ''}" style="flex: 1;">
            `;
        } else {
            currencySpan.style.display = 'none';

            // Crear selector de productos
            let productOptions = BINGO_PRODUCTS.map(
                product =>
                    `<option value="${product}" ${
                        currentValue === product ? 'selected' : ''
                    }>${product}</option>`
            ).join('');

            valueContainer.innerHTML = `
                <select id="${prizeId}Value" style="flex: 1;">
                    ${productOptions}
                </select>
            `;

            // Si se selecciona "Personalizado...", permitir escribir
            const select = document.getElementById(`${prizeId}Value`);
            select.addEventListener('change', e => {
                if (e.target.value === 'Personalizado...') {
                    const customValue = prompt('Ingrese el nombre del producto personalizado:');
                    if (customValue && customValue.trim()) {
                        // Crear una opción personalizada
                        const option = document.createElement('option');
                        option.value = customValue;
                        option.textContent = customValue;
                        option.selected = true;
                        e.target.insertBefore(option, e.target.lastChild);
                    }
                }
            });
        }
    }

    parseMoneyValue(str) {
        // Eliminar puntos, comas y espacios
        return parseInt(str.replace(/[.,\s]/g, '')) || 0;
    }

    formatMoney(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    loadPrizes() {
        const saved = localStorage.getItem('bingoPrizes');
        if (saved) {
            this.prizes = JSON.parse(saved);
            this.updatePrizesUI();
        }
    }

    updatePrizesUI() {
        const prize1Type = document.getElementById('prize1Type');
        const prize1Value = document.getElementById('prize1Value');
        const prize2Type = document.getElementById('prize2Type');
        const prize2Value = document.getElementById('prize2Value');
        const prizeBingoType = document.getElementById('prizeBingoType');
        const prizeBingoValue = document.getElementById('prizeBingoValue');

        if (prize1Type && this.prizes.firstLine) {
            prize1Type.value = this.prizes.firstLine.type;
            prize1Value.value =
                this.prizes.firstLine.type === 'money'
                    ? this.prizes.firstLine.value.toLocaleString('es-CO')
                    : this.prizes.firstLine.value;
            this.updatePrizeCurrency('prize1', this.prizes.firstLine.type);
        }

        if (prize2Type && this.prizes.secondLine) {
            prize2Type.value = this.prizes.secondLine.type;
            prize2Value.value =
                this.prizes.secondLine.type === 'money'
                    ? this.prizes.secondLine.value.toLocaleString('es-CO')
                    : this.prizes.secondLine.value;
            this.updatePrizeCurrency('prize2', this.prizes.secondLine.type);
        }

        if (prizeBingoType && this.prizes.bingo) {
            prizeBingoType.value = this.prizes.bingo.type;
            prizeBingoValue.value =
                this.prizes.bingo.type === 'money'
                    ? this.prizes.bingo.value.toLocaleString('es-CO')
                    : this.prizes.bingo.value;
            this.updatePrizeCurrency('prizeBingo', this.prizes.bingo.type);
        }

        // Actualizar también la visualización en el panel del juego
        this.updatePrizesDisplay();
    }

    updatePrizesDisplay() {
        // Actualizar los premios mostrados en el sidebar derecho del juego
        const prizeBoxes = document.querySelectorAll('.prizes-list .prize-box strong');

        if (prizeBoxes.length >= 3) {
            // Primera línea
            prizeBoxes[0].textContent = this.prizes.firstLine.description || '$50,000 COP';

            // Segunda línea
            prizeBoxes[1].textContent = this.prizes.secondLine.description || '$100,000 COP';

            // Bingo
            prizeBoxes[2].textContent = this.prizes.bingo.description || '$300,000 COP';
        }
    }

    announceNumber(number) {
        if (!this.config.soundEnabled || !('speechSynthesis' in window)) return;

        // Cancelar cualquier anuncio previo
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance();

        // Texto a anunciar: número y recordatorio del tipo de juego
        let texto = `Número ${number}`;

        // Añadir información del tipo de juego cada 5 números
        if (this.gameState.calledNumbers.length % 5 === 0) {
            const modoTexto =
                {
                    full: 'Bingo completo',
                    line: 'Línea',
                    corners: 'Cuatro esquinas',
                    letter: 'Letra',
                    diagonal: 'Diagonal',
                }[this.config.gameMode] || this.config.gameMode;

            texto += `. Jugando ${modoTexto}`;
        }

        utterance.text = texto;
        utterance.lang = 'es-ES';
        utterance.rate = 1.1; // Velocidad ligeramente rápida
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        window.speechSynthesis.speak(utterance);
    }

    playSound(type) {
        if (!this.config.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === 'win') {
                // Sonido de victoria - melodía ascendente
                oscillator.type = 'sine';
                oscillator.frequency.value = 523; // Do
                gainNode.gain.value = 0.3;
                oscillator.start();

                setTimeout(() => {
                    oscillator.frequency.value = 659; // Mi
                }, 100);
                setTimeout(() => {
                    oscillator.frequency.value = 784; // Sol
                }, 200);

                oscillator.stop(audioContext.currentTime + 0.6);
            } else if (type === 'draw') {
                // Sonido agradable para sorteo de número
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(
                    400,
                    audioContext.currentTime + 0.15
                );
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
            } else if (type === 'notification') {
                // Sonido de notificación - tono suave y agradable
                oscillator.type = 'sine';
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.15;
                oscillator.start();

                setTimeout(() => {
                    oscillator.frequency.value = 600;
                }, 80);

                oscillator.stop(audioContext.currentTime + 0.15);
            } else {
                // Sonido genérico
                oscillator.type = 'sine';
                oscillator.frequency.value = 440;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        } catch (error) {
            console.warn('Audio no soportado:', error);
        }
    }

    // ===== GESTIÓN DE CHAT =====
    toggleChat(enabled) {
        this.chat.enabled = enabled;
        const chatPanel = document.getElementById('chatPanel');

        if (enabled) {
            chatPanel.style.display = 'block';
            this.addSystemMessage('Chat habilitado');
        } else {
            chatPanel.style.display = 'none';
        }

        localStorage.setItem('chatEnabled', enabled);

        // Sincronizar con jugadores si es anfitrión
        if (this.multiplayer.enabled && this.multiplayer.isHost) {
            this.broadcastToPlayers({
                type: 'chat_toggle',
                data: { enabled: enabled },
            });
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message || !this.chat.enabled) return;

        const chatMessage = {
            id: Date.now(),
            player: this.config.playerName,
            text: message,
            timestamp: new Date().toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            isHost: this.multiplayer.isHost,
        };

        this.chat.messages.push(chatMessage);
        this.displayChatMessage(chatMessage);

        // Broadcast en modo multijugador
        if (this.multiplayer.enabled && this.multiplayer.isHost) {
            this.broadcastToPlayers({
                type: 'chat_message',
                data: chatMessage,
            });
        } else if (this.multiplayer.enabled && !this.multiplayer.isHost) {
            // Enviar al host
            if (this.multiplayer.connections.size > 0) {
                const hostConnection = Array.from(this.multiplayer.connections.values())[0];
                hostConnection.send({
                    type: 'chat_message',
                    data: chatMessage,
                });
            }
        }

        input.value = '';
    }

    displayChatMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const chatPanel = document.getElementById('chatPanel');

        // Remover mensaje vacío si existe
        const emptyState = chatMessages.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        if (message.isHost) messageDiv.classList.add('host-message');
        if (message.player === this.config.playerName) messageDiv.classList.add('own-message');

        messageDiv.innerHTML = `
            <div class="message-header">
                <strong>${message.player}</strong>
                ${message.isHost ? '<span class="host-badge">Anfitrión</span>' : ''}
                <span class="message-time">${message.timestamp}</span>
            </div>
            <div class="message-text">${this.escapeHtml(message.text)}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Notificar si el chat está cerrado y el mensaje no es del usuario actual
        if (message.player !== this.config.playerName) {
            const chatVisible =
                chatPanel &&
                chatPanel.style.display !== 'none' &&
                window.getComputedStyle(chatPanel).display !== 'none';

            if (!chatVisible || !this.isChatInView()) {
                this.showChatNotification(message);
            }
        }
    }

    isChatInView() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return false;

        const rect = chatMessages.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    showChatNotification(message) {
        // Crear notificación visual
        const notification = document.createElement('div');
        notification.className = 'chat-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-comment"></i>
                <div>
                    <strong>${message.isHost ? '👑 ' : ''}${message.player}</strong>
                    <p>${this.escapeHtml(message.text.substring(0, 50))}${
            message.text.length > 50 ? '...' : ''
        }</p>
                </div>
            </div>
        `;

        // Agregar al body
        document.body.appendChild(notification);

        // Click para ir al chat
        notification.addEventListener('click', () => {
            const chatPanel = document.getElementById('chatPanel');
            if (chatPanel) {
                chatPanel.style.display = 'block';
                chatPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            notification.remove();
        });

        // Reproducir sonido de notificación
        if (this.config.soundEnabled) {
            this.playSound('notification');
        }

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    addSystemMessage(text) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return; // Chat no disponible

        const emptyState = chatMessages.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message system-message';
        messageDiv.innerHTML = `<div class="message-text"><i class="fas fa-info-circle"></i> ${text}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== CONFIGURACIÓN CORPORATIVA =====
    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tamaño (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('El archivo es muy grande. Máximo 2MB.');
            return;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            alert('Por favor seleccione una imagen válida.');
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            const logoUrl = e.target.result;
            this.corporate.logoUrl = logoUrl;

            // Mostrar preview
            const preview = document.getElementById('logoPreview');
            const previewImg = document.getElementById('logoPreviewImg');
            previewImg.src = logoUrl;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    removeLogo() {
        this.corporate.logoUrl = '';
        this.corporate.enabled = false;

        const preview = document.getElementById('logoPreview');
        preview.style.display = 'none';

        const fileInput = document.getElementById('companyLogo');
        fileInput.value = '';

        this.updateCorporateBanner();
        localStorage.removeItem('corporateSettings');
    }

    saveCorporateSettings() {
        const companyName = document.getElementById('companyName').value.trim();
        const companyNit = document.getElementById('companyNit').value.trim();
        const companyAddress = document.getElementById('companyAddress').value.trim();

        // Configuración es completamente opcional
        this.corporate.companyName = companyName;
        this.corporate.nit = companyNit;
        this.corporate.address = companyAddress;

        if (companyName || companyNit || companyAddress || this.corporate.logoUrl) {
            this.corporate.enabled = true;
            localStorage.setItem('corporateSettings', JSON.stringify(this.corporate));
            this.updateCorporateBanner();

            // Sincronizar con jugadores si es anfitrión
            if (this.multiplayer.enabled && this.multiplayer.isHost) {
                this.broadcastToPlayers({
                    type: 'corporate_update',
                    data: { corporate: this.corporate },
                });
            }

            alert('✅ Configuración corporativa guardada correctamente');
        } else {
            // Si no hay nada, desactivar y limpiar
            this.corporate.enabled = false;
            localStorage.removeItem('corporateSettings');
            this.updateCorporateBanner();

            // Sincronizar con jugadores si es anfitrión
            if (this.multiplayer.enabled && this.multiplayer.isHost) {
                this.broadcastToPlayers({
                    type: 'corporate_update',
                    data: { corporate: this.corporate },
                });
            }

            alert('✅ Configuración corporativa desactivada');
        }
    }

    loadCorporateSettings() {
        // Solo cargar desde localStorage si somos el anfitrión o no estamos en multijugador
        // Los jugadores recibirán la configuración del anfitrión vía game_state
        if (this.multiplayer.enabled && !this.multiplayer.isHost) {
            return; // No cargar configuración local, esperar la del anfitrión
        }

        const saved = localStorage.getItem('corporateSettings');
        if (saved) {
            this.corporate = JSON.parse(saved);

            // Actualizar UI
            const companyNameInput = document.getElementById('companyName');
            if (companyNameInput && this.corporate.companyName) {
                companyNameInput.value = this.corporate.companyName;
            }

            const companyNitInput = document.getElementById('companyNit');
            if (companyNitInput && this.corporate.nit) {
                companyNitInput.value = this.corporate.nit;
            }

            const companyAddressInput = document.getElementById('companyAddress');
            if (companyAddressInput && this.corporate.address) {
                companyAddressInput.value = this.corporate.address;
            }

            if (this.corporate.logoUrl) {
                const preview = document.getElementById('logoPreview');
                const previewImg = document.getElementById('logoPreviewImg');
                if (preview && previewImg) {
                    previewImg.src = this.corporate.logoUrl;
                    preview.style.display = 'block';
                }
            }
        }
    }

    updateCorporateBanner() {
        const banner = document.getElementById('corporateBanner');
        const logo = document.getElementById('corporateLogo');
        const name = document.getElementById('corporateName');
        const nit = document.getElementById('corporateNit');
        const address = document.getElementById('corporateAddress');

        if (this.corporate.enabled && (this.corporate.logoUrl || this.corporate.companyName)) {
            banner.style.display = 'flex';

            if (this.corporate.logoUrl) {
                logo.src = this.corporate.logoUrl;
                logo.style.display = 'block';
            } else {
                logo.style.display = 'none';
            }

            if (this.corporate.companyName) {
                name.textContent = this.corporate.companyName;
                name.style.display = 'block';
            } else {
                name.style.display = 'none';
            }

            if (this.corporate.nit) {
                nit.textContent = `NIT: ${this.corporate.nit}`;
                nit.style.display = 'block';
            } else {
                nit.style.display = 'none';
            }

            if (this.corporate.address) {
                address.textContent = this.corporate.address;
                address.style.display = 'block';
            } else {
                address.style.display = 'none';
            }
        } else {
            banner.style.display = 'none';
        }
    }
}

// ===== INICIALIZAR APLICACIÓN =====
let bingoApp;
document.addEventListener('DOMContentLoaded', () => {
    bingoApp = new BingoApp();
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} inicializado`);
});

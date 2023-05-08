import	{
	WebSocketGateway, 
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';
import { Console } from 'console';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export	class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	keyStates: { [key: string]: boolean } = { 
		w: false,
		s: false,
		ArrowUp: false,
		ArrowDown: false 
	};
	
	paddlePositions = { 
		left: 0, 
		right: 0,
	};
	
	canvasDimensions = { width: 0, height: 0 };
	paddleHeight = 0.2;

	ball = {
		x: 0,
		y: 0,
		radius: 10,
		speedX: 2,
		speedY: 2,
	};
	
	scores = {
		left: 0,
		right: 0,
	};
	
	resetScores() {
		this.scores.left = 0;
		this.scores.right = 0;
	}
	
	gameStarted = false;
	gameEnded = false;

	updatePaddlePosition() {
		if (!this.gameStarted) {
			return;
		}
		const speed = 10;
	
		if (this.keyStates.w && this.paddlePositions.left > 0) {
			this.paddlePositions.left -= speed;
		}
		if (this.keyStates.s && this.paddlePositions.left < this.canvasDimensions.height * (1 - this.paddleHeight)) {
			this.paddlePositions.left += speed;
		}
		if (this.keyStates.ArrowUp && this.paddlePositions.right > 0) {
			this.paddlePositions.right -= speed;
		}
		if (this.keyStates.ArrowDown && this.paddlePositions.right < this.canvasDimensions.height * (1 - this.paddleHeight)) {
			this.paddlePositions.right += speed;
		}
	}

	updateBallPosition() {
		if (!this.gameStarted) {
			return;
		}
		const	paddleWidth = 10;
		const	actualPaddleHeight = this.canvasDimensions.height * this.paddleHeight;
	
		// Mettre à jour la position de la Balle
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;
	
		// Collisions avec les limites inférieurs et supérieures du canvas
		if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvasDimensions.height) {
			this.ball.speedY *= -1;
		}
	
		// Collision avec les paddles
		const leftPaddleCollision =
				this.ball.x - this.ball.radius < 10 + paddleWidth &&
				this.ball.y + this.ball.radius > this.paddlePositions.left &&
			this.ball.y - this.ball.radius < this.paddlePositions.left + actualPaddleHeight;
	
			const rightPaddleCollision =
			this.ball.x + this.ball.radius > this.canvasDimensions.width - 10 - paddleWidth &&
				this.ball.y + this.ball.radius > this.paddlePositions.right &&
				this.ball.y - this.ball.radius < this.paddlePositions.right + actualPaddleHeight;
	
		if (leftPaddleCollision || rightPaddleCollision) {
			this.ball.speedX *= -1.1;
	
			const paddle = leftPaddleCollision ? this.paddlePositions.left : this.paddlePositions.right;
			const relativeIntersectY =  this.ball.y - (paddle + (actualPaddleHeight / 2));
	
			// Utiliser une interpolation linéaire pour déterminer la vitesse en Y de la balle
			const maxYSpeed = 8; // Vitesse maximale en Y pour la balle
			this.ball.speedY = (relativeIntersectY / (actualPaddleHeight / 2)) * maxYSpeed;
	
			// Ajuster la position de la balle pour éviter qu'elle ne reste bloquée dans le paddle
			if (leftPaddleCollision) {
				this.ball.x = 10 + paddleWidth + this.ball.radius;
			} else {
				this.ball.x = this.canvasDimensions.width - 10 - paddleWidth - this.ball.radius;
			}
	
		}
	
		// Remise à zéro de la balle si elle sort du canvas sur les côtés gauche ou droit
		if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.canvasDimensions.width) {
			const lostLeftPaddle = this.ball.x - this.ball.radius < 0;
			this.ball.x = this.canvasDimensions.width / 2;
			this.ball.y = this.canvasDimensions.height / 2;
		
			// Si le paddle gauche a perdu, la balle se déplace vers la droite (vitesse positive en X)
			// Sinon, elle se déplace vers la gauche (vitesse négative en X)
			this.ball.speedX = lostLeftPaddle ? -Math.abs(5) : Math.abs(5);
			this.ball.speedY = this.getRandomNumber(-5, 5);
	
			if (lostLeftPaddle) {
				this.scores.right++;
				console.log("Left: ", this.scores.left, ' - ', this.scores.right, " :Right");
			} else  {
				this.scores.left++;
				console.log("Left: ", this.scores.left, ' - ', this.scores.right, " :Right");
			}
	
			// Vérifie si l'un des joueurs a atteint 10 points
			if (this.scores.left === 10 || this.scores.right === 10) {
				this.resetScores();
				this.gameStarted = false;
			}
			}
	};

	getRandomNumber(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	};

	updateInterval: NodeJS.Timeout;

	handleConnection(client: Socket, ...args: any[]) {
		console.log('Client connected Game: ', client.id);
	}

	handleDisconnect(client: Socket) {
		console.log('Cliend Disconnected: ', client.id);
		clearInterval(this.updateInterval);
	}

	sendGameState() {
		this.server.emit('gameState', {
			paddlePositions: this.paddlePositions,
			ball: this.ball,
		});
	}

	@SubscribeMessage('getDimensions')
	onGetDimensions(client: Socket, dimensions: any): void {
		// Écoutez les messages du client pour obtenir les dimensions de la div
		console.log('DivDimensions', dimensions);
		this.canvasDimensions.width = dimensions.width;
		this.canvasDimensions.height = dimensions.height;

		// Mettre à jour le positionnement de la balle
		this.ball.x = this.canvasDimensions.width / 2;
		this.ball.y = this.canvasDimensions.height / 2;

		// Mettre à jour le posionnement des paddles
		this.paddlePositions.left = (this.canvasDimensions.height - this.canvasDimensions.height * this.paddleHeight) / 2;
		this.paddlePositions.right = (this.canvasDimensions.height - this.canvasDimensions.height * this.paddleHeight) / 2;

		setInterval(() => {
			this.updatePaddlePosition;
			this.updateBallPosition;
			this.sendGameState();
		}, 1000 / 60);

	}

	@SubscribeMessage('keyDown')
  onKeyDown(client: Socket, key: string): void {
    // Mettre à jour la position du paddle en fonction de la touche enfoncée 
		if (!this.gameStarted && (key === 'w' || key === 's' || key === 'ArrowUp' || key === 'ArrowDown')) {
			this.gameStarted = true;
			console.log('Premier keyDown');
		}
		this.keyStates[key] = true;
		console.log('Key pressed:', key);
		console.log('Press one time');
  }

  @SubscribeMessage('keyUp')
  onKeyUp(client: Socket, key: string): void {
    // Arrêtre de mettre à jour la position du paddle lorsque la touche est relachée
		this.keyStates[key] = false;
  }
	
}

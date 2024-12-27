// file : engine_render.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_UTILS from './engine_utils.js';
import EG_DATA from './engine_data.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class engineRenderClass
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		this.data = EG_DATA;
	}

	// --------------------------------------------- //
	// FUNCTIONS
	// --------------------------------------------- //
	async game_loop(timestamp)
	{
		const db = this.data;

		if (db.match.end)
			return false;
		if (db.match.winner !== null)
		{
			this.game_over();
			if (db.canvas.elem)
			{
				db.canvas.elem.classList.remove('breathing_bot');
				db.canvas.elem.classList.remove('breathing_top');
			}
			await EG_UTILS.gameStateHandler('end');
			return false;
		}

		db.canvas.ctx.clearRect(0, 0, db.canvas.elem.width, db.canvas.elem.height);
		await this.render_playersName();
		await this.render_ball();
		await this.render_paddles();
		await EG_UTILS.sleep(10);

		db.frame.delta_time = (timestamp - db.frame.last_time) / 1000;
		if (!db.frame.last_time || db.frame.delta_time === 'NaN')
			db.frame.delta_time = 0;
    	db.frame.last_time = timestamp;
		
		await this.game_start();

		requestAnimationFrame(this.game_loop.bind(this));

		return true;
	}

	async game_start()
	{
		const db = this.data;

		db.ball.x += db.ball.dx * db.frame.delta_time;
		db.ball.y += db.ball.dy * db.frame.delta_time;
		this.check_horizontalCollision();
		this.check_verticalCollision();
		this.check_paddleCollision();

		return true;
	}

	async game_over()
	{
		const db = this.data;

		if (db.match.winner === db.player1.name)
		{
			EG_UTILS.announce(`${db.player1.name} wins!`);
			this.render_playersName('p1');
		}
		if (db.match.winner === db.player2.name)
		{
			EG_UTILS.announce(`${db.player2.name} wins!`);
			this.render_playersName('p2');
		}

		return true;
	}

	async render_countdown(num)
	{
		const db = this.data;
		const width = db.canvas.elem.width / 2;
		const height = db.canvas.elem.height / 2;

		db.canvas.ctx.clearRect(0, 0, db.canvas.elem.width, db.canvas.elem.height);
		db.canvas.ctx.fillStyle = db.display.cor_txt;
		db.canvas.ctx.font = 'bold 100px Monospace';
		db.canvas.ctx.textAlign = 'center';
		db.canvas.ctx.textBaseline = 'middle';
		db.canvas.ctx.fillText(num, width, height);

		return true;
	}

	async start_countdown()
	{
		const db = this.data;

		await this.render_countdown(3);
		await EG_UTILS.sleep(1000);
		await this.render_countdown(2);
		await EG_UTILS.sleep(1000);
		await this.render_countdown(1);
		await EG_UTILS.sleep(1000);
		await this.render_countdown('GO!');
		await EG_UTILS.sleep(1000);
		await EG_UTILS.set_keyEvents();

		return true;
	}

	async randomBallDirection()
	{
		const db = this.data;

		// random angle
		let angle = Math.random() * (1.500 - 0.500) + 0.500;
		angle = angle.toFixed(3);
		angle = parseFloat(angle);
		db.ball.dy = angle * db.ball.speed;

		// random direction
		let dir = Math.floor(Math.random() * 2);
		if (dir === 0)
			db.ball.dx *= -1;
		dir = Math.floor(Math.random() * 2);
		if (dir === 0)
			db.ball.dy *= -1;

		return true;
	}

	async render_playersName(winner)
	{
		const db = this.data;

		let p1Name = db.player1.name;
		let p2Name = db.player2.name;

		if (!db.player1.name || typeof db.player1.name !== 'string')
			p1Name = 'Unknown';
		if (!db.player2.name || typeof db.player2.name !== 'string')
			p2Name = 'Unknown';

		if (p1Name.length > 10)
			p1Name = p1Name.slice(0, 10) + '...';
		if (p2Name.length > 10)
			p2Name = p2Name.slice(0, 10) + '...';

		db.canvas.ctx.fillStyle = db.display.cor_txt;
		db.canvas.ctx.font = 'bold 30px Monospace';
		db.canvas.ctx.textAlign = 'center';
		db.canvas.ctx.textBaseline = 'middle';

		let height = db.canvas.elem.height / 2 + 20;
		let width = db.canvas.elem.width / 2;

		db.canvas.ctx.fillText(db.player1.name, width / 2, height);
		db.canvas.ctx.fillText(db.player2.name, width + (width / 2), height);

		let winner_color = db.display.cor_txt;
		db.canvas.ctx.fillStyle = db.display.cor_txt_win;
		if (winner === 'p1')
			db.canvas.ctx.fillText(db.player1.name, width / 2, height);
		if (winner === 'p2')
			db.canvas.ctx.fillText(db.player2.name, width + (width / 2), height);
		db.canvas.ctx.fillStyle = db.display.cor_txt;

		return true;
	}

	async render_ball()
	{
		const db = this.data;

		db.canvas.ctx.beginPath();
		db.canvas.ctx.arc(db.ball.x, db.ball.y, db.ball.r, 0, Math.PI * 2);
		db.canvas.ctx.fillStyle = db.ball.color;
		db.canvas.ctx.fill();
		db.canvas.ctx.closePath();

		return true;
	}

	async render_paddles()
	{
		const db = this.data;

		await this.paddle_generator('p1');
		await this.paddle_generator('p2');

		//event 
		if ((db.key_state['w'] || db.key_state['W']) &&
			db.player1.y - db.paddle.total_len / 2 > 0)
			db.player1.y -= db.paddle.speed * db.frame.delta_time;
		if ((db.key_state['s'] || db.key_state['S']) &&
			db.player1.y + db.paddle.total_len / 2 < db.canvas.elem.height)
			db.player1.y += db.paddle.speed * db.frame.delta_time;
		if (db.key_state['ArrowUp'] &&
			db.player2.y - db.paddle.total_len / 2 > 0)
			db.player2.y -= db.paddle.speed * db.frame.delta_time;
		if (db.key_state['ArrowDown'] &&
			db.player2.y + db.paddle.total_len / 2 < db.canvas.elem.height)
			db.player2.y += db.paddle.speed * db.frame.delta_time;

		return true;
	}

	async paddle_generator(type = 'p1', color)
	{
		const db = this.data;
		if(!color)
			color = db.paddle.color;

		const len = db.paddle.total_len;
		const dentX = db.paddle.dent_x;
		const dentY = db.paddle.dent_y;
		let posX = db.player1.x;
		let posY = db.player1.y;
		if (type === 'p2')
		{
			posX = db.player2.x;
			posY = db.player2.y;
		}
		let topY = posY - len / 2;
		let botY = posY + len / 2;
		let cor = {
			pos1: { x: posX, y: topY },
			pos2: { x: posX, y: botY },
			pos3: { x: posX - dentX, y: botY - dentY },
			pos4: { x: posX - dentX, y: topY + dentY }
		};
		if (type === 'p2')
		{
			cor.pos3 = { x: posX + dentX, y: botY - dentY };
			cor.pos4 = { x: posX + dentX, y: topY + dentY };
		}

		db.canvas.ctx.beginPath();
		db.canvas.ctx.moveTo(cor.pos1.x, cor.pos1.y);
		db.canvas.ctx.lineTo(cor.pos2.x, cor.pos2.y);
		db.canvas.ctx.lineTo(cor.pos3.x, cor.pos3.y);
		db.canvas.ctx.lineTo(cor.pos4.x, cor.pos4.y);
		db.canvas.ctx.fillStyle = color;
		db.canvas.ctx.fill();
	}

	async check_horizontalCollision()
	{
		const db = this.data;
		const ball = db.ball;
		const ballT = ball.y - ball.r;
		const ballB = ball.y + ball.r;

		if (ballT <= 0)
		{
			ball.y = ball.r;
			db.ball.dy = Math.abs(db.ball.dy);
			this.triggerShinnyEffect('top');
		}
		if (ballB >= db.canvas.elem.height)
		{
			ball.y = db.canvas.elem.height - ball.r;
			db.ball.dy = -Math.abs(db.ball.dy);
			this.triggerShinnyEffect('bottom');
		}
	}

	async check_verticalCollision()
	{
		const db = this.data;
		const ball = db.ball;
		const ballR = ball.x + ball.r;
		const ballL = ball.x - ball.r;

		if (ballR >= db.canvas.elem.width)
		{
			db.player1.wins++;
			db.match.winner = db.player1.name;
			alert(`${db.player1.name} wins!`);
		}
		if (ballL <= 0)
		{
			db.player2.wins++;
			db.match.winner = db.player2.name;
			alert(`${db.player2.name} wins!`);
		}
	}

	async triggerShinnyEffect(pos)
	{
		const db = this.data;

		if (pos === 'top')
		{
			db.canvas.elem.classList.add('breathing_top');
			setTimeout(() => {
				if (db.canvas.elem)
				{
					db.canvas.elem.classList.remove('breathing_top');
					db.canvas.elem.style.borderTop = `2px solid ${db.display.cor_bg}`;
				}
			}, 500);
		}
		else if (pos === 'bottom')
		{
			db.canvas.elem.classList.add('breathing_bot');
			setTimeout(() => {
				if (db.canvas.elem)
				{
					db.canvas.elem.classList.remove('breathing_bot');
					db.canvas.elem.style.borderBottom = `2px solid ${db.display.cor_bg}`;
				}
			}, 500);
		}

		return true;
	}

	async triggerDifficultIncrease()
	{
		// increase ball speed
		if (this.data.ball.dx < 400)
		{
			this.data.ball.dx *= 1.06;
			this.data.ball.dy *= 1.03;
		}
		else
		{
			this.data.ball.dx += 20;
			this.data.ball.dy += 10;
		}

		// random number 0.8 - 1.2
		let angle = Math.random() * (1.100 - 0.900) + 0.800;
		angle = angle.toFixed(3);
		angle = parseFloat(angle);
		this.data.ball.dy *= angle;

		if (this.data.paddle.speed <= 500)
			this.data.paddle.speed += 50;

		if (this.data.paddle.total_len > 35)
			this.data.paddle.total_len -= 3;

		return true;
	}

	async check_paddleCollision()
	{
		const db = this.data;
		const ball = db.ball;
		const p1 = db.player1;
		const p2 = db.player2;

		const ballR = ball.x + ball.r;
		const ballL = ball.x - ball.r;
		const ballT = ball.y - ball.r;
		const ballB = ball.y + ball.r;

		const p1T = p1.y - db.paddle.total_len / 2;
		const p1B = p1.y + db.paddle.total_len / 2;

		const p2T = p2.y - db.paddle.total_len / 2;
		const p2B = p2.y + db.paddle.total_len / 2;

		// note : my position of paddle is the front-line center
	
		// handling situation where the ball corder hits the padding edge
		if (ballL <= p1.x || ballR >= p2.x)
			return false;

		// apply smooth collision by adding invi wall (paddleGapX and Y)
		if (ballL <= p1.x + db.paddle.dist_colli_x &&
			ballT >= p1T - db.paddle.dist_colli_y && 
			ballB <= p1B + db.paddle.dist_colli_y)
		{
			db.ball.dx *= -1;
			db.ball.x = p1.x + db.paddle.dist_colli_x + ball.r;
			await this.triggerDifficultIncrease();
		}

		if (ballR >= p2.x - db.paddle.dist_colli_x &&
			ballT >= p2T - db.paddle.dist_colli_y &&
			ballB <= p2B + db.paddle.dist_colli_y)
		{
			//change later please add physic like p1
			db.ball.dx *= -1;
			db.ball.x = p2.x - db.paddle.dist_colli_x - ball.r;
			await this.triggerDifficultIncrease();
		}

		return true;
	}
}

const ENGINE_RENDER = new engineRenderClass();
export default ENGINE_RENDER;

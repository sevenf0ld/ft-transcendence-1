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
	async render_countdown(num)
	{
		const db = this.data;
		const width = db.canvas.width / 2;
		const height = db.canvas.height / 2;

		db.ctx.clearRect(0, 0, db.canvas.width, db.canvas.height);
		db.ctx.fillStyle = db.txt_color;
		db.ctx.font = 'bold 100px Monospace';
		db.ctx.textAlign = 'center';
		db.ctx.textBaseline = 'middle';
		db.ctx.fillText(num, width, height);

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
		// make it 0.5 - 1.5
		let angle = Math.random() * (1.500 - 0.500) + 0.500;
		angle = angle.toFixed(3);
		angle = parseFloat(angle);
		db.ball.dy = angle * db.ballSpeed;

		// random direction
		let dir = Math.floor(Math.random() * 2);
		if (dir === 0)
			db.ball.dx *= -1;
		dir = Math.floor(Math.random() * 2);
		if (dir === 0)
			db.ball.dy *= -1;

		return true;
	}

	// important - core logic
	async game_loop(timestamp)
	{
		const db = this.data;

		if (db.match_winner !== null)
		{
			if (db.canvas)
			{
				db.canvas.classList.remove('breathing_bot');
				db.canvas.classList.remove('breathing_top');
			}
			await EG_DATA.reset();
			return false;
		}

		db.ctx.clearRect(0, 0, db.canvas.width, db.canvas.height);
		await this.render_score();
		await this.render_playersName();
		await this.render_ball();
		await this.render_paddles();
		await EG_UTILS.sleep(10);

		db.deltaTime = (timestamp - db.lastTimeStamp) / 1000;
		if (!db.lastTimeStamp || db.deltaTime === 'NaN')
			db.deltaTime = 0;
    	db.lastTimeStamp = timestamp;
		
		await this.game_start();

		requestAnimationFrame(this.game_loop.bind(this));
		return true;
	}

	async render_score()
	{
		const db = this.data;

		db.ctx.fillStyle = db.txt_color;
		db.ctx.font = '50px Monospace';
		db.ctx.textAlign = 'center';
		db.ctx.textBaseline = 'middle';

		let height = db.canvas.height / 2 - 30;
		let width = db.canvas.width / 4;
		db.ctx.fillText(db.p1_score, width, height);
		db.ctx.fillText(db.p2_score, width * 3, height);

		return true;
	}

	async render_playersName()
	{
		const db = this.data;

		let p1Name = db.p1_name;
		let p2Name = db.p2_name;

		if (!db.p1_name || typeof db.p1_name !== 'string')
			p1Name = 'Unknown';
		if (!db.p2_name || typeof db.p2_name !== 'string')
			p2Name = 'Unknown';

		if (p1Name.length > 10)
			p1Name = p1Name.slice(0, 10) + '...';
		if (p2Name.length > 10)
			p2Name = p2Name.slice(0, 10) + '...';

		db.ctx.fillStyle = db.txt_color;
		db.ctx.font = 'bold 30px Monospace';
		db.ctx.textAlign = 'center';
		db.ctx.textBaseline = 'middle';

		let height = db.canvas.height / 2 + 20;
		let width = db.canvas.width / 2;
		db.ctx.fillText(db.p1_name, width / 2, height);
		db.ctx.fillText(db.p2_name, width + (width / 2), height);

		return true;
	}

	async render_ball()
	{
		const db = this.data;

		db.ctx.beginPath();
		db.ctx.arc(db.ball.x, db.ball.y, db.ball.r, 0, Math.PI * 2);
		db.ctx.fillStyle = db.ball_color;
		db.ctx.fill();
		db.ctx.closePath();

		return true;
	}

	async render_paddles()
	{
		const db = this.data;

		await this.paddle_generator('p1');
		await this.paddle_generator('p2');

		if (this.data.keyState['w'] &&
			db.p1_paddle.pos_y - db.paddle_len / 2 > 0)
			this.data.p1_paddle.pos_y -= this.data.paddleSpeed * this.data.deltaTime;
		if (this.data.keyState['s'] &&
			db.p1_paddle.pos_y + db.paddle_len / 2 < db.canvas.height)
			this.data.p1_paddle.pos_y += this.data.paddleSpeed * this.data.deltaTime;
		if (this.data.keyState['ArrowUp'] &&
			db.p2_paddle.pos_y - db.paddle_len / 2 > 0)
			this.data.p2_paddle.pos_y -= this.data.paddleSpeed * this.data.deltaTime;
		if (this.data.keyState['ArrowDown'] &&
			db.p2_paddle.pos_y + db.paddle_len / 2 < db.canvas.height)
			this.data.p2_paddle.pos_y += this.data.paddleSpeed * this.data.deltaTime;

		return true;
	}

	async paddle_generator(type = 'p1')
	{
		const db = this.data;

		const len = db.paddle_len;
		const dentX = db.paddle_dentX;
		const dentY = db.paddle_dentY;
		let posX = db.p1_paddle.pos_x;
		let posY = db.p1_paddle.pos_y;
		if (type === 'p2')
		{
			posX = db.p2_paddle.pos_x;
			posY = db.p2_paddle.pos_y;
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

		db.ctx.beginPath();
		db.ctx.moveTo(cor.pos1.x, cor.pos1.y);
		db.ctx.lineTo(cor.pos2.x, cor.pos2.y);
		db.ctx.lineTo(cor.pos3.x, cor.pos3.y);
		db.ctx.lineTo(cor.pos4.x, cor.pos4.y);
		db.ctx.fillStyle = db.paddle_color;
		db.ctx.fill();
	}

	async game_start()
	{
		const db = this.data;

		db.ball.x += db.ball.dx * db.deltaTime;
		db.ball.y += db.ball.dy * db.deltaTime;
		this.check_horizontalCollision();
		this.check_verticalCollision();
		this.check_paddleCollision();

		return true;
	}

	async check_horizontalCollision()
	{
		const db = this.data;
		const ball = db.ball;
		const ballR = ball.x + ball.r;
		const ballL = ball.x - ball.r;

		if (ballR > db.canvas.width || ballL < 0)
			db.match_winner = 'someone';
	}

	async check_verticalCollision()
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
		if (ballB >= db.canvas.height)
		{
			ball.y = db.canvas.height - ball.r;
			db.ball.dy = -Math.abs(db.ball.dy);
			this.triggerShinnyEffect('bottom');
		}
	}

	async triggerShinnyEffect(pos)
	{
		const db = this.data;

		if (pos === 'top')
		{
			db.canvas.classList.add('breathing_top');
			setTimeout(() => {
				if (db.canvas)
				{
					db.canvas.classList.remove('breathing_top');
					db.canvas.style.borderTop = `2px solid ${db.bg_color}`;
				}
			}, 500);
		}
		else if (pos === 'bottom')
		{
			db.canvas.classList.add('breathing_bot');
			setTimeout(() => {
				if (db.canvas)
				{
					db.canvas.classList.remove('breathing_bot');
					db.canvas.style.borderBottom = `2px solid ${db.bg_color}`;
				}
			}, 500);
		}

		return true;
	}

	async check_paddleCollision()
	{
		const db = this.data;
		const ball = db.ball;
		const p1 = db.p1_paddle;
		const p2 = db.p2_paddle;

		const ballR = ball.x + ball.r;
		const ballL = ball.x - ball.r;
		const ballT = ball.y - ball.r;
		const ballB = ball.y + ball.r;

		const p1T = p1.pos_y - db.paddle_len / 2;
		const p1B = p1.pos_y + db.paddle_len / 2;

		const p2T = p2.pos_y - db.paddle_len / 2;
		const p2B = p2.pos_y + db.paddle_len / 2;

		// note : my position of paddle is the front-line center
	
		// handling situation where the ball corder hits the padding edge
		if (ballL <= p1.pos_x || ballR >= p2.pos_x)
			return false;

		// apply smooth collision by adding invi wall (paddleGapX and Y)
		if (ballL <= p1.pos_x + db.paddleGapX &&
			ballT >= p1T - db.paddleGapY && 
			ballB <= p1B + db.paddleGapY)
		{
			/*
			//PHYSIC
			const gap1 = db.p1_paddle.pos_y + db.paddle_len / 2;
			const gap2 = db.paddle_len / 2;
			//-1 for top, 0 for middle, 1 for bottom
			const hitPos = (gap1 - ball.y) / gap2;

			// 60 degree
			const maxBounceAngle = Math.PI / 3;
			const angle = maxBounceAngle * hitPos;

			const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
			ball.dx = speed * Math.cos(angle) * (ball.dx > 0 ? 1 : -1);
			ball.dy = speed * Math.sin(angle);

			ball.x = ball.dx > 0
				? p1.pos_x + db.paddleGapX + ball.r
				: p1.pos_x - db.paddleGapX - ball.r;
			*/
			db.ball.dx *= -1;
			db.ball.x = p1.pos_x + db.paddleGapX + ball.r;
		}

		if (ballR >= p2.pos_x - db.paddleGapX &&
			ballT >= p2T - db.paddleGapY &&
			ballB <= p2B + db.paddleGapY)
		{
			//change later please add physic like p1
			db.ball.dx *= -1;
			db.ball.x = p2.pos_x - db.paddleGapX - ball.r;
		}

		return true;
	}


}

const ENGINE_RENDER = new engineRenderClass();
export default ENGINE_RENDER;

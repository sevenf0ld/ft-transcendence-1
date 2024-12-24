// file : engine_data.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class engineData
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		// fixed
		this.sHeight = 270;
		this.sWidth = 750;
		this.bg_color = '#212529';
		this.txt_color = '#292e32';
		this.ball_color = '#f8f9fa';
		this.paddle_color = '#f8f9fa';
		this.match_win_score = 3;
		this.paddle_len = 70;
		this.paddleWall_dist = 30;
		this.paddle_dentX = 5;
		this.paddle_dentY = 15;
		this.midY = this.sHeight / 2;
		this.ballSpeed = 200;
		// dynamic
		this.gameType = null;
		this.canvas = null;
		this.ctx = null;
		this.p1_score = 0;
		this.p1_name = null;
		this.p2_score = 0;
		this.p2_name = null;
		this.match_winner = null;
		this.ball = {
			x: this.sWidth / 2,
			y: this.sHeight / 2,
			r: 5,
			dx: 1 * this.ballSpeed,
			dy: 3 * this.ballSpeed
		};
		this.lastTimeStamp = 0;
		this.deltaTime = 0;
		this.p1_paddle = {
			pos_x: this.paddleWall_dist,
			pos_y: this.sHeight / 2,
		};
		this.p2_paddle = {
			pos_x: this.sWidth - this.paddleWall_dist,
			pos_y: this.sHeight / 2,
		};
	}

	async reset()
	{
		this.gameType = null;
		this.canvas = null;
		this.ctx = null;
		this.p1_score = 0;
		this.p1_name = null;
		this.p2_score = 0;
		this.p2_name = null;
		this.match_winner = null;
		this.ball.x = this.sWidth / 2;
		this.ball.y = this.sHeight / 2;
		this.ball.dx = this.ballSpeed;
		this.ball.dy = this.ballSpeed;
		this.lastTimeStamp = 0;
		this.deltaTime = 0;
		this.p1_paddle.pos_x = this.paddleWall_dist;
		this.p1_paddle.pos_y = this.sHeight / 2;
		this.p2_paddle.pos_x = this.sWidth - this.paddleWall_dist;
		this.p2_paddle.pos_y = this.sHeight / 2;

		return true;
	}

	async setCanvas(c)
	{
		if (!c)
			throw new Error('Canvas not found');
		this.canvas = c;

		return true;
	}

	async setScreenSize()
	{
		this.canvas.width = this.sWidth;
		this.canvas.height = this.sHeight;
		
		return true;
	}

	async resetPlayers()
	{
		this.p1_score = 0;
		this.p2_score = 0;
		this.p1_name = null;
		this.p2_name = null;

		return true;
	}
}

const data = new engineData();
export default data;

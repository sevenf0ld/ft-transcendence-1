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
		/* refactor 
		this.sHeight = 270;
		this.sWidth = 750;
		this.bg_color = '#212529';
		this.txt_color = '#292e32';
		this.ball_color = '#f8f9fa';
		this.paddle_color = '#f8f9fa';

		this.paddleWall_dist = 30;
		this.paddle_dentX = 5;
		this.paddle_dentY = 15;
		this.midY = this.sHeight / 2;
		this.paddleGapX = 15;
		this.paddleGapY = 10;
		// dynamic
		this.ballSpeed = 200;
		this.paddleSpeed = 150;
		this.paddle_len = 70;
		this.gameType = null;
		this.canvas = null;
		this.ctx = null;
		this.p1_score = 0;
		this.p1_name = null;
		this.p2_score = 0;
		this.p2_name = null;
		this.match_winner = null;
		this.match_end = false;
		this.match_pause = false;
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
		this.keyState = {};
		*/
		this.init_display();
		this.obj_ball();
		this.obj_paddle();
		this.obj_player();
		this.init_match();
	}

	async reset()
	{
		this.init_display();
		this.obj_ball();
		this.obj_paddle();
		this.obj_player();
		this.init_match();

		return true;
	}

	async init_display()
	{
		this.display =
		{
			h: 270,
			w: 750,
			cor_bg: '#212529',
			cor_txt: '#292e32',
			cen_y: undefined,
			cen_x: undefined,
		};

		this.display.cen_y = this.display.h / 2;
		this.display.cen_x = this.display.w / 2;

		this.canvas =
		{
			elem: null,
			ctx: null,
		};

		this.frame =
		{
			last_time: 0,
			delta_time: 0,
		};

		return true;
	}

	async obj_ball()
	{
		this.ball =
		{
			color: '#f8f9fa',
			speed: 200,
			x: this.display.cen_x,
			y: this.display.cen_y,
			r: 5,
			dx: undefined,
			dy: undefined,
		};

		this.ball.dx = 1 * this.ball.speed;
		this.ball.dy = 3 * this.ball.speed;

		return true;
	}

	async obj_paddle()
	{
		this.paddle =
		{
			color: '#f8f9fa',
			dist_wall: 30,
			dent_x: 5,
			dent_y: 15,
			dist_colli_x: 15,
			dist_colli_y: 10,
			speed: 200,
			total_len: 70,
			radius: undefined,
		};

		this.paddle.radius = this.paddle.total_len / 2;

		return true;
	}

	async obj_player()
	{
		this.player1 =
		{
			name: null,
			x: undefined,
			y: undefined,
		};

		this.player1.x = this.paddle.dist_wall;
		this.player1.y = this.display.cen_y;

		this.player2 =
		{
			name: null,
			x: undefined,
			y: undefined,
		};
		
		this.player2.x = this.display.w - this.paddle.dist_wall;
		this.player2.y = this.display.cen_y;

		return true;
	}

	async init_match()
	{
		this.match =
		{
			end: false,
			winner: null,
			pause: false,
		};

		this.key_state = {};
	}

	// for external use
	// - pongEngine.js
	async init_canvas(c)
	{
		if (!c)
			throw new Error('Canvas not found');

		this.canvas.elem = c;
		this.canvas.elem.width = this.display.w;
		this.canvas.elem.height = this.display.h;
		this.canvas.ctx = this.canvas.elem.getContext('2d');

		return true;
		DATA.ctx = DATA.canvas.getContext('2d');
	}
}

const data = new engineData();
export default data;

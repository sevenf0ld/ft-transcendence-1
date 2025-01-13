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
		this.gameType = null;
		this.init_display();
		this.obj_ball();
		this.obj_paddle();
		this.obj_player();
		this.init_match();
		this.obj_ai();
	}

	async reset()
	{
		this.gameType = null;
		this.init_display();
		this.obj_ball();
		this.obj_paddle();
		this.obj_player();
		this.init_match();
		this.obj_ai();

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
			cor_txt_win: '#3d5838',
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

	async obj_ai()
	{
		this.ai =
		{
			// reads relavant data every 1 second
			read_ball_y: null,
			read_ball_x: null,
			read_ball_dx: null,
			read_ball_dy: null,
			last_read_time: null,
			read_interval: 1000,
			// moves like a human's keydown event
			predicted_y: this.display.cen_y,
			last_move_time: null,
			move_interval: 10,
			reached: false,
			// have error margin like a human
			difficulty: null,
			error_margin: null,
		};

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
			wins: 0,
		};

		this.player1.x = this.paddle.dist_wall;
		this.player1.y = this.display.cen_y;

		this.player2 =
		{
			name: null,
			x: undefined,
			y: undefined,
			wins: 0,
		};
		
		this.player2.x = this.display.w - this.paddle.dist_wall;
		this.player2.y = this.display.cen_y;

		return true;
	}

	async init_match()
	{
		this.match =
		{
			started: false,
			end: false,
			winner: null,
			loser: null,
			pause: false,
			unexpected_end: null,
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

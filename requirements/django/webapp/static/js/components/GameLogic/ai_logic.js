// file : tnm_logic.js
// -------------------------------------------------- //
// importing-internal
// -------------------------------------------------- //
import EG_RENDER from './engine_render.js';
import EG_DATA from './engine_data.js';
import EG_UTILS from './engine_utils.js';
import ROOM_LIST from '../GameRoomView/RoomList.js';
import ACTION_PANEL from '../GameRoomView/ActionPanel.js';
// -------------------------------------------------- //
// importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
// -------------------------------------------------- //
// main-functions
// -------------------------------------------------- //
class aiLogicClass
{
	// --------------------------------------------- //
	// CONSTRUCTOR
	// --------------------------------------------- //
	constructor()
	{
		this.gameType = 'local-pve';
	}

	async run()
	{
		await this.ai_game_logic();
		return true;
	}

	async ai_game_logic()
	{
		const db = EG_DATA;
		db.obj_ai();

		// set up error margin and difficulty
		let random;
		random = Math.floor(Math.random() * 13) + 2;
		db.ai.difficulty = random;

		random = Math.floor(Math.random() * 31) + 20;
		db.ai.error_margin = random;

		await this.wait();

		return true;
	}

	async wait()
	{
		return new Promise((resolve) =>
		{
			requestAnimationFrame(
				EG_RENDER.game_loop.bind(EG_RENDER, resolve)
			);
		});
	}

	async ai_read_every_second()
	{
		const db = EG_DATA;

		const time_now = performance.now();
		if (db.ai.last_read_time === null
			|| (time_now - db.ai.last_read_time) >= db.ai.read_interval)
		{
			db.ai.read_ball_y = db.ball.y;
			db.ai.read_ball_x = db.ball.x;
			db.ai.read_ball_dy = db.ball.dy;
			db.ai.read_ball_dx = db.ball.dx;
			db.ai.last_read_time = time_now;
			//console.log('AI read ball data');
		}

		return true;
	}

	async ai_algorithmic_move()
	{
		const db = EG_DATA;
		const time_now = performance.now();

		await this.ai_read_every_second();
		await this.bounces_prediction_algorithm();
		await this.close_prediction_algorithm();
		await this.move_to_predicted_y();

		return true;
	}

	async check_if_ai_reached_target_y()
	{
		const db = EG_DATA;
		const current_y = db.player2.y;
		const margin = 10;
		const target_y_top = db.ai.predicted_y - margin;
		const target_y_bottom = db.ai.predicted_y + margin;

		if (current_y > target_y_top && current_y < target_y_bottom)
			db.ai.reached = true;
		else
			db.ai.reached = false;

		return false;
	}

	async move_to_predicted_y()
	{
		const db = EG_DATA;
		const target_y = db.ai.predicted_y;
		const ai_current_y = db.player2.y;
		const time_now = performance.now();

		// make ai moves like human
		if (time_now - db.ai.last_move_time < db.ai.move_interval)
			return true;

		await this.check_if_ai_reached_target_y();

		// prevent ai shaking
		if (db.ai.reached)
			return true;

		// move the ai
		if (ai_current_y < target_y)
		{
			await this.ai_move_down();
			db.ai.last_move_time = time_now;
			return true;
		}

		if (ai_current_y > target_y)
		{
			await this.ai_move_up();
			db.ai.last_move_time = time_now;
			return true;
		}
	}

	async close_prediction_algorithm()
	{
		const db = EG_DATA;
		const time_now = performance.now();
		const time_last_read = db.ai.last_read_time;
		const last_ball_y = db.ai.read_ball_y;
		const time_diff = (time_now - time_last_read) / 1000;
		const max_height = db.canvas.elem.height;
		const dy = db.ai.read_ball_dy;
		const time_base_dy = dy * time_diff;

		let predict_ball_y_now;
		if (last_ball_y + time_base_dy < 0)
			predict_ball_y_now = -last_ball_y - time_base_dy;
		else if (last_ball_y + time_base_dy > max_height)
			predict_ball_y_now = 2 * max_height - last_ball_y - time_base_dy;
		else
			predict_ball_y_now = last_ball_y + time_base_dy;

		// when ball is closer to the ai, use this algorithm instead
		if (db.ai.read_ball_x > db.display.w / 20 * (20 - db.ai.difficulty))
		{
			db.ai.predicted_y = Math.abs(predict_ball_y_now);
			//console.log('ball_y in db is ' + db.ball.y);
			//console.log('last second saved\'s ball_y in aidb is ' + db.ai.read_ball_y);
			//console.log('ball_y in aidb is ' + db.ai.predicted_y);
		}

		return false;
	}

	async bounces_prediction_algorithm()
	{
		const db = EG_DATA;

		// when balls goes to opposite direction,
		// AI will move to the center
		if (db.ai.read_ball_dx < 0)
		{
			db.ai.predicted_y = db.display.cen_y;
			return true;
		}

		const ball_x = db.ai.read_ball_x;
		const ball_y = db.ai.read_ball_y;
		const ball_dx = db.ai.read_ball_dx;
		const ball_dy = db.ai.read_ball_dy;
		
		let timeToReachPaddle = Math.abs((db.player2.x - ball_x) / ball_dx);
		let futureY = ball_y + ball_dy * timeToReachPaddle;
		while (futureY < 0 || futureY > db.canvas.elem.height)
		{
			if (futureY < 0)
				futureY = -futureY;
			else if (futureY > db.canvas.elem.height)
				futureY = 2 * db.canvas.elem.height - futureY;
		}
		futureY += (Math.random() * 2 - 1) * db.ai.error_margin;
		db.ai.predicted_y = futureY;

		return true;
	}

	async ai_move_up()
	{
		const db = EG_DATA;

		if (db.player2.y - db.paddle.total_len / 2 > 0)
			db.player2.y -= db.paddle.speed * db.frame.delta_time;

		return true;
	}

	async ai_move_down()
	{
		const db = EG_DATA;

		if (db.player2.y + db.paddle.total_len / 2 < db.canvas.elem.height)
			db.player2.y += db.paddle.speed * db.frame.delta_time;

		return true;
	}
}

const item = new aiLogicClass();
export default item;

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
		this.init_ai_data();
	}

	async init_ai_data()
	{

		return true;
	}

	async reset(type)
	{
		return true;
	}

	// core logic
	async pre_tour_start(type)
	{
		return true;
	}

	async run()
	{
		await this.ai_game_logic();
		return true;
	}

	async ai_game_logic()
	{
		const db = EG_DATA;

		EG_DATA.ai.start_time = performance.now();

		let random;

		random = Math.floor(Math.random() * 13) + 2;
		db.ai.difficulty = random;

		random = Math.floor(Math.random() * 31) + 20;
		db.ai.error_margin = random;

		console.log(`AI Difficulty: ${db.ai.difficulty}`);
		console.log(`AI Error Margin: ${db.ai.error_margin}`);
		if (db.ai.difficulty <= 3)
			EG_UTILS.announce(`AI Difficulty: Low (${db.ai.difficulty/5})`);
		else if (db.ai.difficulty <= 8)
			EG_UTILS.announce(`AI Difficulty: Medium (${db.ai.difficulty/5})`);
		else
			EG_UTILS.announce(`AI Difficulty: High (${db.ai.difficulty/5})`);


		EG_DATA.ai.last_move_time = null;
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

	async ai_allow_move()
	{
		const db = EG_DATA;

		if (db.ai.last_move_time === null)
			return true;
		else if ((performance.now() - db.ai.last_move_time) >= db.ai.move_interval)
			return true;

		return false;
	}

	async ai_algorithmic_move()
	{
		const db = EG_DATA;

		if ((performance.now() - db.ai.start_time) >= db.ai.update_interval)
		{
			db.ai.start_time = performance.now();

			db.ai.algor_y = await this.bounces_prediction_algorithm();
			db.ai.reached = false;
		}

		const algor_y = db.ai.algor_y;
		if (algor_y < db.player2.y + 20 && algor_y > db.player2.y - 20)
			db.ai.reached = true;

		if (await this.close_prediction_algorithm())
			return true;

		if (algor_y < db.player2.y && !db.ai.reached && await this.ai_allow_move())
		{
			await this.ai_move_up();
			db.ai.last_move_time = performance.now();
		}
		else if (algor_y > db.player2.y && !db.ai.reached && await this.ai_allow_move())
		{
			await this.ai_move_down();
			db.ai.last_move_time = performance.now();
		}

		return true;
	}
	
	async close_prediction_algorithm()
	{
		const db = EG_DATA;

		if (db.ball.x > db.display.w / 20 * (20 - db.ai.difficulty))
		{
			db.ai.algor_y = db.ball.y;
			
			if (db.ai.algor_y < db.player2.y && await this.ai_allow_move())
			{
				await this.ai_move_up();
				db.ai.last_move_time = performance.now();
			}
			else if (db.ai.algor_y > db.player2.y && await this.ai_allow_move())
			{
				await this.ai_move_down();
				db.ai.last_move_time = performance.now();
			}

			return true;
		}

		return false;
	}

	async bounces_prediction_algorithm()
	{
		if (EG_DATA.ball.dx < 0)
			return EG_DATA.display.cen_y;

		const db = EG_DATA;
		const ballY = db.ai.algor_y;

		let timeToReachPaddle = Math.abs((db.player2.x - db.ball.x) / db.ball.dx);
		let futureY = ballY + db.ball.dy * timeToReachPaddle;
		while (futureY < 0 || futureY > db.canvas.elem.height)
		{
			if (futureY < 0)
				futureY = -futureY;
			else if (futureY > db.canvas.elem.height)
				futureY = 2 * db.canvas.elem.height - futureY;
		}

		futureY += (Math.random() * 2 - 1) * db.ai.error_margin;

		return futureY;
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

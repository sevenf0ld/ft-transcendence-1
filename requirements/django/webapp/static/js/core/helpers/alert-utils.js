// file : fetch-utils.js
// -------------------------------------------------- //
// Importing-internal
// -------------------------------------------------- //
// -------------------------------------------------- //
// Importing-external
// -------------------------------------------------- //
// -------------------------------------------------- //
// developer notes
// -------------------------------------------------- //
class alert_utils
{
	// --- [00] CONSTRUCTOR
	constructor()
	{
		this.container = null;
		this.type = null;
		this.msg = null;
	}

	async init()
	{
		this.container = null;
		this.type = null;
		this.msg = null;

		return true;
	}

	// --- [00] SETTERS
	async setType(type)
	{
		if (this.type)
			this.container.classList.remove(this.type);
		this.type = type;
		return true;
	}
	
	async setMsg(msg)
	{
		this.msg = msg;
		return true;
	}

	// --- [00] RENDER
	async alert_clear()
	{
		this.container.textContent = '';
		if (this.type && this.container.classList.contains(this.type))
			this.container.classList.remove(this.type);
		if (!this.container.classList.contains('d-none'))
			this.container.classList.add('d-none');
	}

	async alert_render()
	{
		if (this.type === '' || this.msg === '')
			throw new Error('[ERR] alert_utils : type or msg not set');
		if (!this.container.classList.contains('d-none'))
			throw new Error('[ERR] alert_utils : alert not hidden');
		this.container.textContent = this.msg;
		this.container.classList.add(this.type);
		this.container.classList.remove('d-none');
	}

	async alert_danger(string)
	{
		await this.setType('alert-danger');
		await this.setMsg(string);
		await this.alert_clear();
		await this.alert_render();

		return true;
	}

	async alert_success(string)
	{
		await this.setType('alert-success');
		await this.setMsg(string);
		await this.alert_clear();
		await this.alert_render();

		return true;
	}

	async alert_warning(string)
	{
		await this.setType('alert-warning');
		await this.setMsg(string);
		await this.alert_clear();
		await this.alert_render();

		return true;
	}

	async alert_info(string)
	{
		await this.setType('alert-info');
		await this.setMsg(string);
		await this.alert_clear();
		await this.alert_render();

		return true;
	}
}

// -------------------------------------------------- //
// export
// -------------------------------------------------- //
const item = new alert_utils();
export default item;

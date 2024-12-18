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
export default class alert_utils
{
	// --- [00] CONSTRUCTOR
	constructor(alert_div)
	{
		this.alert_div = alert_div;
		this.type = '';
		this.msg = '';
	}

	// --- [00] SETTERS
	async setType(type)
	{
		if (this.type)
			this.alert_div.classList.remove(this.type);
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
		this.alert_div.textContent = '';
		if (this.type && this.alert_div.classList.contains(this.type))
			this.alert_div.classList.remove(this.type);
		if (!this.alert_div.classList.contains('d-none'))
			this.alert_div.classList.add('d-none');
	}

	async alert_render()
	{
		if (this.type === '' || this.msg === '')
			throw new Error('[ERR] alert_utils : type or msg not set');
		if (!this.alert_div.classList.contains('d-none'))
			throw new Error('[ERR] alert_utils : alert not hidden');
		this.alert_div.textContent = this.msg;
		this.alert_div.classList.add(this.type);
		this.alert_div.classList.remove('d-none');
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
export { alert_utils };

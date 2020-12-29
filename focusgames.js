let auto_bot = {
	// log: console.log,
	log: function(){},
	url: window.location.href,
	interval: false,
	casino: false,
	dice: false,
	timeout: 500,
	auto_rolls: 0,
	start_btn: '<br /><button type="button" class="btn btn-cyan auto_roll_btn btn_start" style="margin-left: 3px;margin-right: 3px;margin-top: -3px;padding:4px;height:26px;line-height:0;" onclick="auto_bot.auto_roll_start(this)">Start </button>',
	stop_btn: '<button type="button" class="btn btn-cyan auto_roll_btn btn_stop" style="margin-left: 3px;margin-right: 3px;margin-top: -3px;padding:4px;height:26px;line-height:0;" onclick="auto_bot.auto_roll_stop(this)"> Stop </button>',
	thresh_hold_input: '<input type="text" class="auto_roll_thresh_hold" value="" style="width: 95px" placeholder="Stop If Below" /> ',
	bet_start_input: '<input type="text" class="auto_roll_bet_start" value="" style="width: 85px" placeholder="Bet Start" /> ',
	bet_max_loss: '<input type="text" class="bet_max_loss" style="width: 100px" value="" placeholder="Max Loss" /> ',
	increase_on_loss_input: '<input type="text" class="increase_on_loss" style="width: 120px" onkeyup="$(this).val(parseInt($(this).val()))" value="" placeholder="Increase On Loss" /> ',
	time_out_input: '<input type="text" class="time_out" style="width: 95px" onkeyup="$(this).val(parseInt($(this).val()) ?? 0)" value="500" placeholder="Turn Timeout" /> ',
	buttons_container: $('<div class="auto_bot_buttons_container"></div>')[0],
	get_clean_url: function(url_extention){
		let ls = auto_bot.url.split("#");
		ls = ls[0].split("?");
		ls = ls[0];
		if(typeof url_extention !== "undefined")
			ls = ls+url_extention;
		return ls;
	},
	do_auto: function(){return auto_bot.url.indexOf('do_auto') !== -1},
	set_threshold: function(){
		let balance = $('.casino-game-layout-sidebar-balance-amount-holder .amount').html();
		let bet_amount = $('#casino-game-layout-bet-amount').val();
		let bet_currency = $('.casino-game-layout-sidebar-balance-amount-holder .casino-game-layout-currency').html();
		let to_fixed = 8;
		if (typeof balance === 'undefined') {
			balance = $('.dice-sidebar-balance-amount-holder .amount').html();
			bet_amount = $('#dice-bet-amount').val();
			bet_currency = $('.dice-sidebar-balance-amount-holder .dice-currency').html();
		}
		let margin = parseFloat(bet_amount) * 5;
		if ("FGN EXP".indexOf(bet_currency) !== -1) {
			to_fixed = 1;
			margin = 150;
		}

		let thresh_hold = parseFloat(balance).toFixed(to_fixed) - (margin);
		thresh_hold = thresh_hold.toFixed(to_fixed)
		if ($('.auto_roll_thresh_hold').val() === "")
			$('.auto_roll_thresh_hold').val(thresh_hold);
		if ($('.auto_roll_bet_start').val() === "")
			$('.auto_roll_bet_start').val(0.001);
	},
	auto_roll_start: function(){

		if ($('.auto_roll_btn.btn_start').hasClass('disabled'))
			return false;

		auto_bot.auto_roll_stop();

		auto_bot.log("Auto Roll Started");
		auto_bot.interval = setInterval(auto_bot.initiate_auto_role, auto_bot.timeout);
		auto_bot.set_threshold();

		$('.auto_roll_btn.btn_start').attr('disabled', true).addClass('disabled');
		$('.auto_roll_btn.btn_stop').attr('disabled', false).removeClass('disabled');

	},
	auto_roll_stop: function(){
		if ($('.auto_roll_btn.btn_stop').hasClass('disabled'))
			return false;
		auto_bot.log("Auto Roll Stopped");
		auto_bot.interval && clearInterval(auto_bot.interval);
		auto_bot.interval = false;

		$('.auto_roll_btn.btn_start').attr('disabled', false).removeClass('disabled');
		$('.auto_roll_btn.btn_stop').attr('disabled', true).addClass('disabled');

		return false;

	},
	reset_to_start: function(){
		auto_bot.log('Going Back to start');
		auto_bot.auto_roll_stop();
		$('.dice-roll-result-profit').removeClass('win').removeClass('lose');
		if ($('.auto_roll_bet_start').val() == "")
			$('.auto_roll_bet_start').val("0.001")
		let start_bet_amount = parseFloat($('.auto_roll_bet_start').val());
		let while_counter = 0;
		while (parseFloat($('#dice-bet-amount').val()) > start_bet_amount) {

			if (while_counter >= 250) {
				return false;
			}
			$('#dice-bet-amount-half').click();
			while_counter++;
		}
		auto_bot.auto_roll_start();

		return false;
	},
	do_auto_reload: function(){window.location.href = auto_bot.get_clean_url("?do_auto=1");},
	check_and_setup_buttons: function(){
		auto_bot.casino = $('#game-play-btn').length > 0;
		auto_bot.dice = $('#dice-roll').length > 0;

		if ($('.btn.auto_roll_btn').length === 0) {

			if(auto_bot.casino){
				$(auto_bot.buttons_container).append(
					auto_bot.thresh_hold_input+
					auto_bot.start_btn+
					auto_bot.stop_btn+
					auto_bot.time_out_input
				)
				$('#game-play-btn').parent().append(auto_bot.buttons_container);
			}else
			if(auto_bot.dice){
				$(auto_bot.buttons_container).attr('style', "position: absolute; margin-top: -238px;")
				$(auto_bot.buttons_container).append(
					auto_bot.thresh_hold_input+
					auto_bot.bet_start_input+
					auto_bot.increase_on_loss_input+
					auto_bot.bet_max_loss+
					auto_bot.start_btn+
					auto_bot.stop_btn+
					auto_bot.time_out_input
				)
				$('#dice-roll').parent().append(auto_bot.buttons_container);
			}

			if(auto_bot.casino || auto_bot.dice)
			{
				$('.chatbox-card').parent().remove();
				$('.navbar-alert, .horizontal-main, .casino-game-layout-nav').remove();
			}

		}
	},
	initiate_auto_role: function(){
		auto_bot.log('initiate_auto_role');
		auto_bot.log(auto_bot.auto_rolls);
		auto_bot.check_and_setup_buttons();
		auto_bot.timeout = parseInt($('.auto_bot_buttons_container .time_out').val());

		auto_bot.log(auto_bot.timeout);

		if ($('.dice-roll-result-profit.win').length+$('.dice-roll-result-profit.lose').length > 0){

			let bet_amount = $('#dice-bet-amount').val();
			if ($('.dice-roll-result-profit').hasClass('lose')) {
				let max_loss = $('.bet_max_loss').val();
				let current_loss = $('.dice-roll-result-profit .amount').html();
				if (parseFloat(current_loss) > parseFloat(max_loss)) {
					return auto_bot.reset_to_start();
				} else {
					let total_increase = parseInt($('input.increase_on_loss').val());
					for(let i =1; i <= total_increase; i++)
						$('#dice-bet-amount-double').click();
				}
			} else {
				return auto_bot.reset_to_start();
			}
		};

		let thresh_hold = $('.auto_roll_thresh_hold').val();

		let balance = $('.casino-game-layout-sidebar-balance-amount-holder .amount').html();
		if (typeof balance === 'undefined')
			balance = $('.dice-sidebar-balance-amount-holder .amount').html();

		if (parseFloat($('.casino-game-layout-game-result-last-win .amount').html()) > parseFloat($('#casino-game-layout-bet-amount').val()) * 20) {
			auto_bot.do_auto_reload();
			return auto_bot.auto_roll_stop();
		}

		if (typeof thresh_hold !== 'undefined' && parseFloat(balance) <= parseFloat(thresh_hold)) {
			return auto_bot.auto_roll_stop();
		} else
		if (auto_bot.casino || auto_bot.dice) {

			if ($('input.auto_roll_thresh_hold').val() === "") {

				auto_bot.log("Threshold is required for auto roll.");

				$('.auto_roll_thresh_hold').focus();

				return auto_bot.auto_roll_stop();

			} else {

				$('#game-play-btn:not(disabled):not(.disabled)').click();
				$('#dice-roll:not(disabled):not(.disabled)').click();
				auto_bot.auto_rolls++;

			}

		}

	},
}

try {

	$(function(){
		auto_bot.interval = setInterval(auto_bot.initiate_auto_role, auto_bot.timeout);
		setTimeout(function(){
			if(auto_bot.do_auto()){
				auto_bot.log('starting_automatic');
				auto_bot.auto_roll_start();
			};

		}, 3000);

		setTimeout(function(){
			if(auto_bot.url.indexOf('faucet') !== -1)
			{
				if(auto_bot.url.indexOf('claim_btn') === -1)
					$('#claim_form #claim_btn').click();
				else{
					$('select[name="captcha_type"]').val(0).trigger('change');
					$('.app-header, .horizontal-main').remove();
				}
			}
		}, 500);

	});

}catch (e) {

}

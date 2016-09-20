(function(){"use strict";TS.registerModule("web.pricing",{active_plan:"standard",members:0,members_for_calcs:0,credits:0,plans:{lite:{label:"Free",classname:"lite",annual:0,monthly:0,annual_per_month_dollars:0,annual_per_month_cents:0},standard:{label:"Standard",classname:"standard",annual:80,monthly:8,annual_per_month_dollars:6,annual_per_month_cents:67},plus:{label:"Plus",classname:"plus",annual:150,monthly:15,annual_per_month_dollars:12,annual_per_month_cents:50},enterprise:{label:"Enterprise",classname:"enterprise",annual:490,monthly:49,annual_per_month_dollars:40,annual_per_month_cents:83}},onStart:function(){TS.web.login_sig.add(TS.web.pricing.onLogin,TS.web.pricing)},onLogin:function(ok,data){TS.web.pricing.members=boot_data.active_members;TS.web.pricing.bindUI()},bindUI:function(){_$modal=$("#plan_modal");$("#team_members").val(TS.web.pricing.members);$(".plans .plan .plan_card").on("click",function(e){var $plan=$(this).closest(".plan");var plan_name=$plan.data("plan-name");if(plan_name=="standard"){e.preventDefault();window.location="/pricing/standard";return}if(plan_name=="plus"){e.preventDefault();window.location="/pricing/plus";return}if(plan_name=="enterprise"){e.preventDefault();window.location=$(this).parent().find("a.detail_button").attr("href");return}$(".plan").removeClass("active");$plan.addClass("active");TS.web.pricing.active_plan=plan_name;TS.web.pricing.update();TS.web.pricing.members_for_calcs=TS.web.pricing.members;$("#team_members").val(TS.web.pricing.members_for_calcs);$("#team_members").trigger("textchange");e.preventDefault();_$modal.modal("show")});$(".btn.create_free").on("click",function(e){e.preventDefault();window.location="/create";return});$(".plan").hover(function(){var plan_name=$(this).data("plan-name");if(plan_name=="enterprise")return;$(".plan_details").find('.column[data-plan="'+plan_name+'"]').addClass("active")},function(){$(".plan_details").find('.column[data-plan="'+$(this).data("plan-name")+'"]').removeClass("active")});$("#team_members").on("textchange",function(){var num=parseInt($.trim($(this).val()));if(parseInt(num)>5e3){num=5e3;$("#team_members").val(5e3)}if(parseInt(num)){TS.web.pricing.members_for_calcs=parseInt(num)}else{TS.web.pricing.members_for_calcs=TS.web.pricing.members}TS.web.pricing.update()});$("#annual_toggle").on("change",function(){if($(this).is(":checked")){TS.web.pricing.is_annual=true}else{TS.web.pricing.is_annual=false}TS.web.pricing.update()}).trigger("change");$(".team_credits").html("$"+TS.web.pricing.format_currency(TS.web.pricing.credits));_$nav=$(".common_questions_nav");_$tweet_section=$(".from_the_wall_of_love");_$tweet_carousel=$(".tweet_carousel");_$tweet_carousel_container=$(".tweet_carousel_container");_$window=$(window);_win_scroll_top=_$window.scrollTop();_win_height=_$window.height();_nav_offset=_$nav.offset();_nav_height=_$nav.height();_$common_questions_section=$(".common_questions_and_resources");_section_offset=_$common_questions_section.offset();_section_height=_$common_questions_section.height();_top_padding=_win_height/2-_nav_height/2;_fixed_set=false;_stuck_to_bottom=false;_categories=_calculateQuestionCategoryOffests();_updateQuestionNavPosition();_updateQuestionNavState(_categories,_win_scroll_top);if(_$tweet_carousel.length)_startTweetAnimation();_$window.scroll(_scrollHander);_$window.resize(function(){TS.utility.throttle.method(_windowResizeHandler)});_$tweet_section.find(".tweet_carousel_controls a").on("click",function(e){e.preventDefault();_stopTweetAnimation();var action=$(e.currentTarget).data("action");switch(action){case"left":return _moveTweetAnimationLeft();case"right":return _moveTweetAnimationRight()}});$(".question_list h4 a").on("click",function(e){e.preventDefault();var $question_header=$(e.target).closest("li");$question_header.toggleClass("expanded");$question_header.find(".ts_icon").toggleClass("ts_icon_plus_square_o").toggleClass("ts_icon_minus_square_o");_categories=_calculateQuestionCategoryOffests();_updateQuestionNavState(_categories,_$window.scrollTop());_section_height=_$common_questions_section.height()});$(".common_questions_nav li a").on("click",function(e){var id=$(e.target).data("associated-section-id");var category=_categories.filter(function(element){return element.id===id});if(category.length===0)return;var scroll_position=category[0].top;$("html, body").animate({scrollTop:scroll_position+10},500);e.preventDefault()});$(".back_to_the_top .btn").on("click",function(e){$("html, body").animate({scrollTop:0},500);e.preventDefault()})},update:function(){if(!_modal_initialized){_$modal.detach().appendTo("body");_modal_initialized=true}var plan=TS.web.pricing.plans[TS.web.pricing.active_plan];_$modal.removeClass("lite standard").addClass(plan.classname)},format_currency:function(num){var rounded_num=(Math.round(num*100)/100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",");return rounded_num}});var _modal_initialized=false;var _$nav;var _$tweet_section;var _$tweet_carousel;var _$tweet_carousel_container;var _$window;var _$common_questions_section;var _$modal;var _nav_offset;var _nav_height;var _win_scroll_top;var _win_height;var _section_offset;var _section_height;var _top_padding;var _fixed_set;var _stuck_to_bottom;var _categories;var _tweet_animation_interval=false;var _CATEGORY_PADDING_TOP_PX=10;var _NUMBER_OF_TWEETS=$(".tweet_carousel li").length;var _SHOW_TWEET_DURATION_MS=5e3;function _scrollHander(){_win_scroll_top=_$window.scrollTop();_updateQuestionNavPosition();_updateQuestionNavState(_categories,_win_scroll_top)}function _windowResizeHandler(){_resetQuestionNavPosition();_nav_offset=_$nav.offset();_win_height=_$window.height();_win_scroll_top=_$window.scrollTop();_section_offset=_$common_questions_section.offset();_section_height=_$common_questions_section.height();_top_padding=_win_height/2-_nav_height/2;var force_reposition=true;_updateQuestionNavPosition(force_reposition)}function _calculateQuestionCategoryOffests(){var categories=[];$(".question_category").each(function(){categories.push({id:$(this).attr("id"),top:$(this).offset().top-_CATEGORY_PADDING_TOP_PX})});return categories}function _updateQuestionNavPosition(force_reposition){var FUDGE_FACTOR=16;if(_win_scroll_top>_nav_offset.top-_top_padding){if(_win_scroll_top>_section_offset.top+_section_height-_nav_height-_top_padding-FUDGE_FACTOR){_$nav.addClass("stuck_to_bottom").css({top:_section_offset.top+_section_height-_nav_height-FUDGE_FACTOR});_stuck_to_bottom=true}else if(_stuck_to_bottom){_$nav.removeClass("stuck_to_bottom").css({top:""});_stuck_to_bottom=false}else if(!_fixed_set||force_reposition){_$nav.detach().appendTo("body").addClass("fixed");_fixed_set=true}}else if(_fixed_set){_resetQuestionNavPosition()}}function _resetQuestionNavPosition(){_$nav.removeClass("stuck_to_bottom").css({top:""});_$nav.removeClass("fixed").detach();$(".section_content h2").after(_$nav);_stuck_to_bottom=false;_fixed_set=false}function _updateQuestionNavState(categories,win_scroll_top){$(".common_questions_nav li a").removeClass("active");for(var i=categories.length-1;i>=0;i--){if(win_scroll_top>categories[i].top){$('.common_questions_nav li a[data-associated-section-id="'+categories[i].id+'"]').addClass("active");return}}$('.common_questions_nav li a[data-associated-section-id="product"]').addClass("active")}function _moveTweetAnimationLeft(){if(bowser.msie){_$tweet_carousel.find("li").each(function(){var $el=$(this);var current_position=parseInt($el.attr("data-position"),10);var new_position=(current_position+1)%_NUMBER_OF_TWEETS;$el.attr("data-position",new_position)})}else{_$tweet_section.addClass("animate");_$tweet_carousel_container.addClass("animate left");setTimeout(function(){_$tweet_section.removeClass("animate");_$tweet_carousel.find("li").each(function(){var $el=$(this);var current_position=parseInt($el.attr("data-position"),10);var new_position=(current_position+1)%_NUMBER_OF_TWEETS;$el.attr("data-position",new_position)});_$tweet_carousel_container.removeClass("animate left")},500)}}function _moveTweetAnimationRight(){if(bowser.msie){_$tweet_carousel.find("li").each(function(){var $el=$(this);var current_position=parseInt($el.attr("data-position"),10);var new_position=((current_position-1)%_NUMBER_OF_TWEETS+_NUMBER_OF_TWEETS)%_NUMBER_OF_TWEETS;$el.attr("data-position",new_position)})}else{_$tweet_section.addClass("animate");_$tweet_carousel_container.addClass("animate right");setTimeout(function(){_$tweet_section.removeClass("animate");_$tweet_carousel.find("li").each(function(){var $el=$(this);var current_position=parseInt($el.attr("data-position"),10);var new_position=((current_position-1)%_NUMBER_OF_TWEETS+_NUMBER_OF_TWEETS)%_NUMBER_OF_TWEETS;$el.attr("data-position",new_position)});_$tweet_carousel_container.removeClass("animate right")},500)}}function _startTweetAnimation(){if(!_tweet_animation_interval){_tweet_animation_interval=setInterval(_moveTweetAnimationRight,_SHOW_TWEET_DURATION_MS)}}function _stopTweetAnimation(){clearInterval(_tweet_animation_interval);_tweet_animation_interval=false}})();

$(document).ready(function(){
	
	$("#backlog").sortable({
		connectWith: ["#wip"], placeholder: "drop-area", items: 'li:not(.ui-state-disabled)'
	});
	$("#wip").sortable({
		connectWith: [".wipDrop"], placeholder: "drop-area"
	});
	$("#done").sortable({
		connectWith: ["#wip"], placeholder: "drop-area"
	});


	createDlgNewStory();
	createDlgAddTaskToStory();
	createDlgNewTask();

	
	$("#stories-div").toggle();
	$("#stories-toggle").click(function(){
		$("#stories-div").toggle(500);
	});
	
	
	var createStoryBtn = $("#createStory");
	createButton(createStoryBtn, function(){$("#dlgNewStory").dialog('open');});
	
	var toggleTasksBtn = $(".toggleTasks");
	$(".story div.tasks").hide();
	createButton(toggleTasksBtn, function(obj){obj.parent().next().toggle();});
	
	var addTask = $(".addTask");
	createButton(addTask, function(obj){
		addTaskBtn = obj;
		$("#dlgAddTaskToStory").dialog('open');
	});
	
	var commitStoryBtn = $(".commitStory");
	createButton(commitStoryBtn, function(obj){commitStory(obj);});
	
	var createTaskBtn = $("#createTask");
	createButton(createTaskBtn, function(){$("#dlgNewTask").dialog('open');});

	var expandTaskBtn = $(".expandTask");
    expandTaskBtn.parent().next().hide();
	createButton(expandTaskBtn, function(obj){obj.parent().next().toggle();});

	var editTaskBtn = $(".editTask");
	createButton(editTaskBtn, function(){alert('Edit task. Not implemented.');});

	var expandListBtn = $(".expandList");
	toggleList(expandListBtn);
	createButton(expandListBtn, toggleList);	
	
	createToolTips();
});

function createDlgNewStory(){
	var creator = $("#creator");
    var summary = $("#summary");
	var tips = $("#validateTipsStory");
	var allFields = $([]).add(creator).add(summary);

	$("#dlgNewStory").dialog({
		bgiframe: true,
		autoOpen: false,
		modal: true,
		buttons: {
			'Create a story': function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');
	
				bValid = bValid && checkLength(creator, "creator", 3, 16, tips);
				bValid = bValid && checkLength(summary, "summary", 3, 100, tips);
				if (bValid) {
					var story = createStory(creator.val(), summary.val());
					$("#stories").append(story);
					$(this).dialog('close');
				}
	
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			allFields.val('').removeClass('ui-state-error');
		}
	});
}

function createDlgAddTaskToStory(){
	var info = $("#task-info");
	var tips = $("#validateTipsAddTask");
	var allFields = $([]).add(info);
	
	$("#dlgAddTaskToStory").dialog({
		bgiframe: true,
		autoOpen: false,
		modal: true,
		buttons: {
			'Add a task': function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');
	
				bValid = bValid && checkLength(info, "info", 3, 100, tips);
				if (bValid) {
					var liTask = '<li>' + info.val() + '</li>';
					addTaskBtn.prev().append(liTask);
					$(this).dialog('close');
				}
	
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			allFields.val('').removeClass('ui-state-error');
		}
	});
}

function createStory(creator, summary){
	return $(
	"<li>" + 
		"<span class='story'>" +
			"<span class='title-bar'>" +
				"<span class='story-points'>0</span>" +
				"<span class='status none tipme' title='Not committed.'></span>" +
			"</span>" +
			"<span class='summary'>" + summary + "<button class='toggleTasks column-button ui-button ui-state-default ui-corner-all'>+</button></span>" +
			"<ul class='task-list'>" + 
			"</ul>" +
			"<span class='footer'>" +
				"<button class='commitStory ui-button ui-state-default ui-corner-all'>commit</button>" +
				"<span class='creator'>Creator:<span class='value'>" + creator + "</span></span>" +
			"</span>" +
		"</span>" +
	"</li>"
	);
}

function createDlgNewTask(){
	var user = $("#user");
    var estimate = $("#estimate");
	var title = $("#title");
	var details = $("#details");
	var tips = $("#validateTipsTask");
	var allFields = $([]).add(user).add(title).add(details);
	$("#dlgNewTask").dialog({
		bgiframe: true,
		autoOpen: false,
		modal: true,
		buttons: {
			'Create a task': function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');
	
				bValid = bValid && checkLength(user, "user name", 3, 16, tips);
				bValid = bValid && checkLength(title, "title", 3, 25, tips);
				bValid = bValid && checkLength(details, "details", 3, 100, tips);
				if (bValid) {					
					//expand the backlog list
					$("#backlog button.expandList").parent().nextAll('li').show();
					var task = createTask(estimate.val(), estimate.val(), user.val(), title.val(), details.val(), 'Susan Blue');
					$("#backlog").append(task);
					$(this).dialog('close');
				}
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			allFields.val('').removeClass('ui-state-error');
		}
	});
}

function commitStory(obj){
	if(confirm("Commit will move this story's tasks to the backlog. Is this what you want to do?")){
		//expand the backlog list
		$("#backlog button.expandList").parent().nextAll('li').show();
		// get the story element
		var story = obj.parent().parent();
		// get the status indicator
		var status = story.find(".status");
		status.removeClass("none").addClass("committed");
		status.attr("title", "These tasks are committed.");
		// get the task list
		var tasks = story.find(".task-list li");
		var creator = story.find(".creator span.value").text();
		tasks.each(function(){
			var title = $(this).text();
			var task = createTask(0, 0, "Unassigned", title, "Unknown", creator);
			$("#backlog").append(task);
		});
		// remove the commit button
		obj.remove();
	}
}

function createTask(remaining, estimate, assignee, title, details, creator){
	return $(
	"<li>" +
		 "<span class='task'>" +
			 "<span class='title-bar'>" + remaining + "/" + estimate +
				 "<span class='status none tipme' title='This task has no status'></span>" +
				 "<span class='user'>" + assignee + "</span>" +
			 "</span>" +
			 "<span class='title'>" + title + "<button class='expandTask column-button ui-button ui-state-default ui-corner-all'>+</button></span>" +
			 "<span class='details'>" + details + "</span>" +
			 "<span class='footer'>" +
			 	"<button class='editTask ui-button ui-state-default ui-corner-all'>?</button> " +
				"<span class='estimate'>Estimate:<span class='value'>" + estimate + "</span></span>" + 
				"<span class='creator'>Creator:<span class='value'>" + creator + "</span></span>" + 
			"</span>" +
		 "</span>" +
	"</li>");
}

function checkLength(o, n, min, max, tip) {
	if (o.val().length > max || o.val().length < min) {
		o.addClass('ui-state-error');
		var msg = "Length of " + n + " must be between " + min + " and " + max + ".";
		tip.text(msg).effect("highlight", {}, 1500);
		return false;
	} else {
		return true;
	}
}

function toggleList(obj){
	var li = obj.parent().nextAll('li').slideToggle(200);
}

/* button */
function createButton(btn, callback) {
	if(callback==undefined){
		callback = function(){alert('No callback specified');};
	}
	btn.live('click', function(){callback($(this));})
		.live('mouseover', function() {
			$(this).addClass('ui-state-hover');
		}).live('mouseout', function() {
			$(this).removeClass('ui-state-hover');
		}).live('mousedown', function() {
			$(this).addClass('ui-state-active');
		}).live('mouseup', function() {
			$(this).removeClass('ui-state-active');
		});
}

/* tooltip */
function createToolTips(){

		// default configuration properties
		var options = {
			xOffset: -100,
			yOffset: -25,
			tooltipId: "tooltip",
			cssClass: "tooltip",
			clickRemove: false,
			content: "",
			useElement: ""
		};
		var title;
		$(".tipme").live('mouseover', function(e) {
			if($("#" + options.tooltipId).length>0){
				//only one tooltip at a time
				return;
			}
			title = $(this).attr("title");
			var content = title;
			$(this).attr("title", ""); 
			if (content != "" && content != undefined) {
				$("body").append("<div id='" + options.tooltipId + "' class='" + options.cssClass + "'>" + content + "</div>");
				$("#" + options.tooltipId)
					.css("position", "absolute")
					.css("top", (e.pageY - options.yOffset) + "px")
					.css("left", (e.pageX + options.xOffset) + "px")
					.css("display", "none")
					.fadeIn("fast")
			}
		}).live('mouseout', function() {
			$("#" + options.tooltipId).remove();
			$(this).attr("title", title);
		}).live('mousemove', function(e) {
			$("#" + options.tooltipId)
				.css("top", (e.pageY - options.yOffset) + "px")
				.css("left", (e.pageX + options.xOffset) + "px")
		});
}


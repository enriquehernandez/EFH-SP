var urlBaseServiciosBreezeApi = "http://localhost:2496/EFH/";

function objDiccionario(llave, valor){
    this.llave = llave;
    this.valor = valor;
}

var varModalOption = {
    keyboard: true,
    backdrop: true
}

var varDatepickerOptions = {
    dateFormat: 'dd/mm/yy',
    changeMonth: false,
    changeYear: false
}

/* button */
function createButton(btn, callback) {
    if (callback == undefined) {
        callback = function () { alert('No callback specified'); };
    }
    btn.on('click', function () { callback($(this)); })
		.on('mouseover', function () {
		    $(this).addClass('ui-state-hover');
		}).on('mouseout', function () {
		    $(this).removeClass('ui-state-hover');
		}).on('mousedown', function () {
		    $(this).addClass('ui-state-active');
		}).on('mouseup', function () {
		    $(this).removeClass('ui-state-active');
		});
}

/* tooltip */
function createToolTipsProyectos(parentElement) {
    //$(parentElement).find(".tipme").tooltip({ delay: { show: 500, hide: 500 } });
    $(parentElement).find(".showTooltip").tooltip();
}

function createToolTipsProyectosOLD(element) {

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
    //$(".tipme").on('mouseover', function (e) {
    //$(element).on("mouseover", ".tipme", function (e) {
    $(element).find(".tipme").on("mouseover", function (e) {
        if ($("#" + options.tooltipId).length > 0) {
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
    }).on('mouseout', function () {
        $("#" + options.tooltipId).remove();
        $(this).attr("title", title);
    }).on('mousemove', function (e) {
        $("#" + options.tooltipId)
            .css("top", (e.pageY - options.yOffset) + "px")
            .css("left", (e.pageX + options.xOffset) + "px")
    });
}


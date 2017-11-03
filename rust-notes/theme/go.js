$( document ).ready(function() {

    $("code.language-go").each(function(block){
        var hiding_character = "#";
        var code_block = $(this);
        var pre_block = $(this).parent();

        // hide lines
        var lines = code_block.html().split("\n");
        var first_non_hidden_line = false;
        var lines_hidden = false;

        for(var n = 0; n < lines.length; n++){
            if($.trim(lines[n])[0] == hiding_character){
                if(first_non_hidden_line){
                    lines[n] = "<span class=\"hidden\">" + "\n" + lines[n].replace(/(\s*)# ?/, "$1") + "</span>";
                }
                else {
                    lines[n] = "<span class=\"hidden\">" + lines[n].replace(/(\s*)# ?/, "$1") + "\n"  +  "</span>";
                }
                lines_hidden = true;
            }
            else if(first_non_hidden_line) {
                lines[n] = "\n" + lines[n];
            }
            else {
                first_non_hidden_line = true;
            }
        }
        code_block.html(lines.join(""));

        // If no lines were hidden, return
        if(!lines_hidden) { return; }

        // add expand button
        pre_block.prepend("<div class=\"buttons\"><i class=\"fa fa-expand\" title=\"Show hidden lines\"></i></div>");
        
        pre_block.find("i").click(function(e){
            if( $(this).hasClass("fa-expand") ) {
                $(this).removeClass("fa-expand").addClass("fa-compress");
                $(this).attr("title", "Hide lines");
                pre_block.find("span.hidden").removeClass("hidden").addClass("unhidden");
            }
            else {
                $(this).removeClass("fa-compress").addClass("fa-expand");
                $(this).attr("title", "Show hidden lines");
                pre_block.find("span.unhidden").removeClass("unhidden").addClass("hidden");
            }
        });

        // Add play button
        var buttons = pre_block.find(".buttons");
        if( buttons.length === 0 ) {
            pre_block.prepend("<div class=\"buttons\"></div>");
            buttons = pre_block.find(".buttons");
        }
        buttons.prepend("<i class=\"fa fa-play hidden play-button \" title=\"Run this code\"></i>");
        buttons.prepend("<i class=\"fa fa-copy clip-button\" title=\"Copy to clipboard\"><i class=\"tooltiptext\"></i></i>");

        // let code_block = pre_block.find("code").first();
        if (window.ace && code_block.hasClass("editable")) {
            buttons.prepend("<i class=\"fa fa-history reset-button\" title=\"Undo changes\"></i>");
        }

        buttons.find(".play-button").click(function(e){
            run_go_code(pre_block);
        });
        buttons.find(".clip-button").mouseout(function(e){
            hideTooltip(e.currentTarget);
        });
        buttons.find(".reset-button").click(function() {
            if (!window.ace) { return; }
            let editor = window.ace.edit(code_block.get(0));
            editor.setValue(editor.originalCode);
            editor.clearSelection();
        });
    });


    var clipboardSnippets = new Clipboard('.clip-button', {
        text: function(trigger) {
            hideTooltip(trigger);
            let playpen = $(trigger).parents("pre");
            return playpen_text(playpen);
        }
    });
    clipboardSnippets.on('success', function(e) {
            e.clearSelection();
            showTooltip(e.trigger, "Copied!");
    });
    clipboardSnippets.on('error', function(e) {
            showTooltip(e.trigger, "Clipboard error!");
    });
});



function run_go_code(code_block) {
    var result_block = code_block.find(".result");
    if(result_block.length === 0) {
        code_block.append("<code class=\"result hljs language-bash\"></code>");
        result_block = code_block.find(".result");
    }

    let text = playpen_text(code_block);

    result_block.text("Running...");

// ajax({
//     url: "https://golang.org/compile",              //请求地址
//     type: "POST",                       //请求方式
//     data: {version: 2, body: text},        //请求参数
//     dataType: "json",
//     success: function (response, xml) {
//         // 此处放成功后执行的代码
//         result_block.text(response);
//     },
//     fail: function (status) {
//         // 此处放失败后执行的代码
//         console.log(status)
//     }
// });


    $.ajax({
        url:"https://golang.org/compile", 
        method: "POST",
        crossDomain: true,
        dataType: "text",
        // contentType:"text/html",
        data:{version: 2, body: text},
        timeout:15000,
    }).then(function(response){
        var str = "";
        if (response.Errors != ""){
            result_block.text(response.Errors);
        }
        response.Events.forEach(function(e) {
             str+=e.Message+"<br/>";
        }, this);
        result_block.text(str);
    //  }).fail(function(qXHR, textStatus, errorThrown){
    //     result_block.text("Playground communication " + textStatus);
    }).always(function(data,textStatus,jqXHR){
        console.log(data);
        console.log(textStatus);
        console.log(jqXHR);
    });
}

var comment_count = 0;
var comments = {};

$('#files .commit-comment').each(function(){
    comments[$(this).attr('id')] = true;
});


function loadComments(){
    $.ajax({
        url: window.location.href,
        processData: false,
        beforeSend: function(xhr){
            // Keeps jquery from telling the server it's AJAX
            return;
        },
        success: function(d){
            $(d).find('.inline-comment-placeholder').each(function(){
                
                var insert_after = $(this).closest('tr').prev().find('.line_numbers a').attr('id'),
                    remote = $(this).attr('remote'),
                    comment_count = 0;

                (function(remote, insert_after){
                    $.ajax({
                        url: remote,
                        processData: false,
                        success: function(c){

                            next = $('#' + insert_after).closest('tr').next();
                            if(next.hasClass('inline-comments')) {
                                next.remove();
                            }

                            $('#' + insert_after).closest('tr').after(c);

                            $(c).find('.commit-comment').each(function(){
                                if(!comments[$(this).attr('id')]) {
                                    $('.body', '#' + $(this).attr('id')).css('background-color', '#FFFFCF');
                                    comment_count++;
                                    console.log(comment_count);
                                } else {
                                    comments[$(this).attr('id')] = true;
                                }
                            });

                        }
                    });
                })(remote, insert_after);


            });
        }
    });
    return false;
}


refresh = $('<a href="#" style="position:fixed;left:0;bottom:0;">refresh</a>').appendTo('body');
refresh.click(loadComments)
{
    function deleteNotification(){
        $('.deleteNotification').click(function(event){
           event.preventDefault();
           $.ajax({
               url:$(this).prop('href'),
               type: 'get',
               success:function(data){
                    new Noty({
                        theme: 'relax',
                        text: "Notification Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    $(`.notification-${data.data.notification._id}`).remove();
               }
           }).fail(function(){
                new Noty({
                    theme: 'relax',
                    text: "Error",
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
           });
        });
    }
    deleteNotification();
}
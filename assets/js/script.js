{
    function sendNotification(){
        $('.notify').click(function(event){
           event.preventDefault();
           $.ajax({
               url:$(this).prop('href'),
               type: 'get',
               success:function(data){
                    new Noty({
                        theme: 'relax',
                        text: "Notification Sent",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    $(`.loan-${data.data.loan._id}`).text(`Notifications Sent-${data.data.loan.notificationSent} times`);
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
    sendNotification();
}
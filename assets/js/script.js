{
    function sendNotification(){
        $('.notify').click(function(event){
           event.preventDefault();
           console.log($(this).prop('href'));
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
                    console.log(data);
                    $(`.loan-${data.data.loan._id}`).text(`Notifications Sent-${data.data.loan.notificationSent} times`);
               }
           }).fail(function(){
               console.log('Error');
           });

        });
    }
    sendNotification();
}
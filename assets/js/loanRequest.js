{
    function processLoanRequest(){
       $('.approveLoan').click(function(event){
          event.preventDefault();
          $.ajax({
            url:$(this).prop('href'),
            type: 'get',
            success:function(data){
                 new Noty({
                     theme: 'relax',
                     text: "Loan Approved",
                     type: 'success',
                     layout: 'topRight',
                     timeout: 1500
                     
                 }).show();
                 $(`.loan-${data.data.loan._id}`).remove();
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

       $('.rejectLoan').click(function(event){
        event.preventDefault();
        $.ajax({
            url:$(this).prop('href'),
            type: 'get',
            success:function(data){
                 new Noty({
                     theme: 'relax',
                     text: "Loan Request Rejected",
                     type: 'success',
                     layout: 'topRight',
                     timeout: 1500
                     
                 }).show();
                 $(`.loan-${data.data.loan._id}`).remove();
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

    processLoanRequest();
}
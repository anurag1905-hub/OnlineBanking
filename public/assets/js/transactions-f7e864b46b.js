{function processTransaction(){$(".approveTransaction").click((function(t){t.preventDefault(),$.ajax({url:$(this).prop("href"),type:"get",success:function(t){new Noty({theme:"relax",text:"Transaction Approved",type:"success",layout:"topRight",timeout:1500}).show(),$(`.transaction-${t.data.neft._id}`).remove()}}).fail((function(){new Noty({theme:"relax",text:"Error",type:"error",layout:"topRight",timeout:1500}).show()}))})),$(".rejectTransaction").click((function(t){t.preventDefault(),$.ajax({url:$(this).prop("href"),type:"get",success:function(t){new Noty({theme:"relax",text:"Transaction Rejected",type:"success",layout:"topRight",timeout:1500}).show(),$(`.transaction-${t.data.neft._id}`).remove()}}).fail((function(){new Noty({theme:"relax",text:"Error",type:"error",layout:"topRight",timeout:1500}).show()}))}))}processTransaction()}
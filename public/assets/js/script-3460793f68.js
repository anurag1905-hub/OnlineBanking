{function sendNotification(){$(".notify").click((function(t){t.preventDefault(),console.log($(this).prop("href")),$.ajax({url:$(this).prop("href"),type:"get",success:function(t){new Noty({theme:"relax",text:"Notification Sent",type:"success",layout:"topRight",timeout:1500}).show(),console.log(t),$(`.loan-${t.data.loan._id}`).text(`Notifications Sent-${t.data.loan.notificationSent} times`)}}).fail((function(){new Noty({theme:"relax",text:"Error",type:"error",layout:"topRight",timeout:1500}).show(),console.log("Error")}))}))}sendNotification()}
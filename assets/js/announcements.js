{

    function createAnnouncement(){
        let newAnnouncementForm = $('.newAnnouncementForm');
        newAnnouncementForm.submit(function(event){
           event.preventDefault();
           $.ajax({
               type:'post',
               url:'/admin/addAnnouncement',
               data:newAnnouncementForm.serialize(),
               success:function(data){
                  let newAnnouncement = newAnnouncementDom(data.data.announcement);
                  $('.announcements-container').prepend(newAnnouncement);
                  
                  deleteDomAnnouncement($(' .deleteAnnouncement',newAnnouncement));

                  new Noty({
                    theme: 'relax',
                    text: "Announcement Added!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

               },error:function(error){
                    new Noty({
                        theme: 'relax',
                        text: "Error",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
               }
           });
        });
    }

    let newAnnouncementDom = function(announcement){
        return $(`<li class="announcement-${announcement._id}">
           ${announcement.content}
        <br>
        <a href="/admin/deleteAnnouncement/${announcement._id}" class="deleteAnnouncement">
            <span style="color:blue;text-decoration: none;">Delete Announcement&nbsp;</span> <i class="fas fa-trash-alt"></i>
        </a>
        </li>`
        );
    }

    function deleteDomAnnouncement(deleteLink){
        $(deleteLink).click(function(event){
           event.preventDefault();
           $.ajax({
               type:'get',
               url:$(deleteLink).prop('href'),
               success:function(data){
                    new Noty({
                        theme: 'relax',
                        text: "Announcement Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    $(`.announcement-${data.data.id}`).remove();
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

    function deleteAnnouncement(){
        $('.deleteAnnouncement').click(function(event){
           event.preventDefault();
           $.ajax({
            url:$(this).prop('href'),
            type: 'get',
            success:function(data){
                 new Noty({
                     theme: 'relax',
                     text: "Announcement Deleted",
                     type: 'success',
                     layout: 'topRight',
                     timeout: 1500
                     
                 }).show();
                 $(`.announcement-${data.data.id}`).remove();
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

    createAnnouncement()
    deleteAnnouncement();
}
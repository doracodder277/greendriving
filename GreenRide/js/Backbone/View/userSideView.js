var UserSideView = Backbone.View.extend({
    events: {
        "click .relation": "userPress"
    },
    el: "#relation-side-navigation-container",
    child: ".relations-container",
    mobileChild: "#mobile-relations-container",
    mobileUserNav: "#client-menue-side-navigation-container",
    relationTemplate: "",
    initialize: function() {
        var self = this;
        this.hide();
        $("#waiting-page").addClass("hide");
        this.relationTemplate = _.template($('#relation-side-template').html());
        window.selectedRelation.set((new CoachingRelation()).attributes);
        window.fetchCoachRelations();
        _.bindAll(this, "userPress", "addClient", "updateRelationState", "hide");
        this.listenToOnce(window.coachRelations, "sync", this.renderAll);
        this.listenTo(window.selectedRelation, "sync", this.updateSelected);
        this.bindAutocomplete("#client-mail-search", window.clientEmails);
        $("#add-client").click(function(e) {

            self.addClient(e);
        }
        );
        $("#mobile-clients-overview-switch").click(function() 
        {
            $("#waiting-page").addClass("hide");
            if(window.coachRelations.models.length > 0 )
            {
                if($("#mobile-relations-container").css("right") != "0px")
                {
                    $('.client-menue-button-collapse').sideNav('show');
                    $("#sidenav-overlay").remove();
                    $('.relations-button-collapse').sideNav('show');
                    $("#sidenav-overlay").remove();
                }

                window.selectedRelation.set(new CoachingRelation().attributes);
            }

        });
        $('.relations-button-collapse').sideNav({
            edge: 'right',
            dismissible: false,
            // Choose the horizontal origin
            closeOnClick: false // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
        );
        $('.client-menue-button-collapse').sideNav({
            edge: 'right',
            dismissible: false,
            // Choose the horizontal origin
            closeOnClick: false // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
        );
        
        $('.relations-button-collapse').sideNav('show');
        $("#sidenav-overlay").remove();
        this.render();
    },
    bindAutocomplete: function(target, items) {

        var self = this;
        var me = this;
        $(target).autocomplete({
            minLength: 1,
            messages: {
                noResults: '',
                results: ""
            },
            open: function(event, ui)
            {
                $("#client-details").addClass("hide")
                $('#client-mails-container').removeClass("hide");
                $(".addClient").click(function(e) {
                    //$("#client-mail-search").parent().children("label").removeClass("active")
                    //$($("#email").parent().children()[1]).addClass("active");
                    //$("#email").val($(e.currentTarget).attr("id"));
                    $("#client-mail-search").val($(e.currentTarget).attr("id"));
                    $('#client-mails-container').empty();
                    $('#client-mails-container').addClass("hide");
                    $("#client-details").removeClass("hide")
                    self.updateSelectedClientInfos($(e.currentTarget).attr("id"));
                }
                );

            },
            response: function(event, ui) {
                $('#client-mails-container').empty();
                $('#client-mails-container').addClass("hide");
            },
            source: function(request, response) {
                //var nameArray = $.map(items,function(meal){
                //	return {'label' : meal.name,'value':meal.mealID};
                //});
                var results = $.ui.autocomplete.filter(items, request.term);
                results = results.sort(function(a, b) {
                    return a.label.length - b.label.length
                }
                );
                response(results);
            }
        }).data("uiAutocomplete")._renderItem = function(ul, item) {

            //return $("<div class='autocompleteEntry stdWhite categoryColorDark"+ item.timeslot+ "' id='"+item.value+"' data-mealID='"+item.value+"'>"+item.label+"</div>")
            return $("<li class=\"addClient collection-item\" id='" + item.value + "'><div>" + item.label + "<a href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">add</i></a></div></li>")
            .appendTo($('#client-mails-container'));
        }
        ;
    },
    hide: function() 
    {
        this.$el.addClass("hide");
        $('#add-client-modal').closeModal();
        $(this.child).empty();
        $(this.mobileChild).empty();
        this.stopListening();
        $("#waiting-page").addClass("hide");
    },
    updateSelectedClientInfos: function(clientEmail) 
    {
        var client = window.fetchClient(clientEmail);
        $("#client-full-name").html(client.get("nickname"));
        //$("#client-full-name").parent().children("label").addClass("active");
        $("#relation-image").attr("src", client.get("imageURL"));
        client.on("sync", function() 
        {
            $("#client-full-name").html(client.get("nickname"));
            //$("#client-full-name").parent().children("label").addClass("active");
            $("#relation-image").attr("src", client.get("imageURL"));
            client.off();
        });
    
    },
    renderAll: function() {
        self = this;
        
        $(this.child).append(" <li class=\"collection-item center userHeader\"><div>My clients</div></li>");
        $(this.mobileChild).append(" <li class=\"collection-item center userHeader\"><div>My clients</div></li>");
        
        window.coachRelations.forEach(function(model) {
            self.addRelation(model);
        }
        );
        
        this.listenTo(window.coachRelations, "add", this.addRelation);
        this.listenTo(window.coachRelations, "change", this.updateRelationState);
        this.delegateEvents();
    },
    updateRelationState: function(model) 
    {
        var id = model.get("clientEmail");
        if (model.changed.relationState != undefined) 
        {
            $($("[data-clientId= \'" + id + "\']")[0]).children()[1].remove();
            $($("[data-clientId= \'" + id + "\']")[1]).children()[1].remove();
            
            if (window.selectedRelation.get("clientEmail") == model.get("clientEmail")) 
            {
                window.selectedRelation.set(model.attributes);
            }
        } 
        else if (model.changed.clientNickname != undefined) 
        {
            $($($($("[data-clientId= \'" + id + "\']")[0]).children()[0]).children(".title")[0]).text(model.get("clientNickname"));
            $($($($("[data-clientId= \'" + id + "\']")[1]).children()[0]).children(".title")[0]).text(model.get("clientNickname"));
            if (window.selectedRelation.get("clientEmail") == model.get("clientEmail")) 
            {
                window.selectedRelation.set({
                    clientVorname: model.get("clientNickname")
                });
            }
        } 
        else if (model.changed.imageURL != undefined) 
        {
            $($($("[data-clientId= \'" + model.get("clientEmail") + "\']")[1]).children()[0]).children()[0].src = model.get("imageURL");
            $($($("[data-clientId= \'" + model.get("clientEmail") + "\']")[0]).children()[0]).children()[0].src = model.get("imageURL");
        }
    
    
    },
    render: function() {
        this.$el.removeClass("hide");
        this.delegateEvents();
    },
    updateSelected: function() {
        
        if (window.selectedRelation.get("clientEmail") != "" && window.selectedRelation.get("relationState") == 1) 
        {
            $("#add-comment-button-flt").removeClass("hide");
            $("#add-plan-flt").removeClass("hide");
        } 
        else 
        {
            $("#add-comment-button-flt").addClass("hide");
            $("#add-plan-flt").addClass("hide");
        }
        $('.userSelected').removeClass("userSelected");
        $($("[data-clientId=\'" + window.selectedRelation.get("clientEmail") + "\' ]")[0]).addClass("userSelected");
        $($("[data-clientId=\'" + window.selectedRelation.get("clientEmail") + "\' ]")[1]).addClass("userSelected");
        if (window.selectedRelation.get("relationState") == 0) 
        {
            this.render();
        } 
        else 
        {
            window.selectedClient = window.fetchClient(window.selectedRelation.get("clientEmail"));
            this.updateClientInfos();
            this.listenTo(window.selectedClient, "change", this.updateClientInfos);
            this.render();
        }
    
    
    },
    updateClientInfos: function() 
    {
        $(".clientName").html(window.selectedClient.get("nickname") != "" ? window.selectedClient.get("nickname") : "Unknown User");
        var relation = "nutrition and fitness";
        if (window.selectedRelation.get("relationType") == "FITNESS") 
        {
            relation = "fitness";
        } 
        else if (window.selectedRelation.get("relationType") == "NUTRITION") 
        {
            relation = "nutrition";
        }
        $(".clientRole").html(relation);
        if (window.selectedRelation.get("imageURL") != "")
            $('.clientPicture').attr("src", window.selectedClient.get("imageURL"));
    },
    stopDataPusher : function (userEmail, userId) {
        new Firebase("https://" + window.subpath + ".firebaseio.com/ops/demoManager/esa-disable-pusher-"+userId).set({
            enable:false,
            userEmail:userEmail,
            op:"manageLiveDemoData",
            state:"req"
        });
    },
    userPress: function(e) {
        
        e.preventDefault();

        $("#waiting-page").addClass("hide");
        var x = window.coachRelations.findWhere({
            clientEmail: e.currentTarget.dataset.clientid
        });

        this.stopDataPusher(e.currentTarget.dataset.clientid, e.currentTarget.id);

        if (window.selectedRelation.get("clientEmail") != x.get("clientEmail")) 
        {
            window.selectedRelation.set(x.attributes);
            this.updateSelected();
            $('.relations-button-collapse').sideNav('hide');
        }
        if (window.selectedRelation.get("clientEmail") != "" && window.selectedRelation.get("relationState") == 1) 
        {
            $('.relations-button-collapse').sideNav('show');
            $("#sidenav-overlay").remove();
            $('.client-menue-button-collapse').sideNav('show');
            $("#sidenav-overlay").remove();
        }
        if (window.selectedRelation.get("relationState") == 0) 
        {
            Materialize.toast('The client did not yet accepted your invitation !', 4000);
            $("#waiting-page").removeClass("hide");
            return;
        } 
        
        
        else if (window.selectedRelation.get("relationState") == 2) 
        {
            Materialize.toast('<span>This client invited you, do you accept the invitation ?</span><a class="btn-flat yellow-text" href="#!" id="accept-button">Accept<a>', 5000);
            $("#accept-button").click(function(e) {
                window.coachRelations.get(window.selectedRelation.id).set({
                    relationState: 1
                });
                $(".toast").remove();
            }
            );
            return;
        }
        
        
        
        window.navigationView.activeView.show();
    },
    addRelation: function(model) {
        if (model.get("coachEmail") != firebase.auth().currentUser.email)
            return;
        
        $(this.child).append(this.relationTemplate(model.toJSON()));
        $(this.mobileChild).append(this.relationTemplate(model.toJSON()));
        /*if (window.selectedRelation.get("clientEmail") == "")
        {
            window.selectedRelation.set(model.attributes);
            this.updateSelected();
        }*/
    },
    addClient: function(e) {
        e.preventDefault();
        console.log("ADD CLIENT");
        var role = window.coach.get("role");
        if (window.coach.get("role") == "BOTH")
            role = $("#client-role").val();
        
        if (window.validateEmail($("#client-mail-search").val()))
        {
            
            var existingRelation = window.coachRelations.findWhere({
                clientEmail: $("#client-mail-search").val().toLowerCase()
            });
            if (existingRelation != undefined) 
            {
                $("#client-mail-search").removeClass("valid");
                $("#client-mail-search").addClass("invalid");
                if (existingRelation.get("relationType") == role) 
                {
                    
                    $(".error-message").html(_.escape("Client already exists!")).show();
                } 
                else 
                {
                    $(".error-message").html(_.escape("Relation already exist with a different relation type.!")).show();
                    //$('#client-exists-modal').openModal();
                    if (confirm("relation already exist with a different relation type.Do you want to reset the relation type?") == true) {
                        //TODO remove when adding PUBNUB sync		
                        var m = window.coachRelations.get(existingRelation);
                        m.set("relationType", role);
                        $('#add-client-modal').closeModal();
                    
                    }
                }
                
                return;
            } 
            else 
            {
                
                
                var temp = new CoachingRelation();
                temp.set({
                    clientEmail: $("#client-mail-search").val().toLowerCase(),
                    coachEmail: window.coach.get("email"),
                    relationType: role,
                    startDate: new Date().getTime(),
                    relationState: 0,
                    clientNickname: $("#client-full-name").val(),
                    imageURL: "images/profile.png"
                
                });
                var relations = new Firebase("https://" + window.subpath + ".firebaseio.com/" + "relations");
                relations.push(temp.attributes);
                
                $('#add-client-modal').closeModal();
                $("#client-mail-search").addClass("valid");
                $("#client-mail-search").removeClass("invalid");
                $(".error-message").html(_.escape("")).hide();
            }
        } 
        else 
        {
            $(".error-message").html(_.escape("Can not add client : Wrong Email")).show();
            $("#client-mail-search").removeClass("valid");
            $("#client-mail-search").addClass("invalid");
        
        }
        
        
        
        /* var dialog = "#dialog";
        var id = "#relationClientEmail";
        var type;
        var height = 450;
        var clientVorname = $("#relationClientVorname").val();
        var clientSurname = $("#relationClientSurname").val();
        if (window.coach.get("role") == "FitnessExpert") 
        {
            dialog = "#fitnessDialog";
            id = "#fitnessRelationClientEmail";
            type = "Fitness";
            height = 400;
            clientVorname = $("#frelationClientVorname").val();
            clientSurname = $("#frelationClientSurname").val();
        } 
        else if (window.coach.get("role") == "NutritionExpert") 
        {
            dialog = "#nutritionDialog";
            id = "#nutritionRelationClientEmail";
            type = "Nutrition";
            clientVorname = $("#nrelationClientVorname").val();
            clientSurname = $("#nrelationClientSurname").val();
            height = 400;
        }
        $(dialog).dialog({
            autoOpen: true,
            maxWidth: 600,
            maxHeight: 300,
            width: 350,
            height: height,
            buttons: {
                "Invite": function() {
                    var clientEmail = $(id).val();
                    console.log(clientVorname);
                    if (window.coach.get("role") == "NutritionANDFitnessExpert") 
                    {
                        type = $('#newRelationType').val();
                    }
                    if (window.validateEmail(clientEmail)) 
                    {
                        
                        var existingRelation = window.coachRelations.findWhere({
                            clientEmail: clientEmail
                        });
                        if (existingRelation != undefined) 
                        {
                            if (existingRelation.get("relationType") == type) 
                            {
                                console.log(existingRelation.get("relationType"));
                                console.log(type);
                                $(".error-message").html(_.escape("Client already exists!")).show();
                            } 
                            else 
                            {
                                if (confirm("relation already exist with a diffrent relation type.Do you want to reset the relation type?") == true) {
                                    //TODO remove when adding PUBNUB sync		
                                    var m = window.coachRelations.get(existingRelation);
                                    m.set("relationType", type);
                                    $(this).dialog("close");
                                    return;
                                } else {
                                    $(this).dialog("close");
                                    return;
                                }
                            }
                            
                            return;
                        } 
                        else 
                        {
                            if (window.coach.get("role") == "FitnessExpert") 
                            {
                                clientVorname = $("#frelationClientVorname").val();
                                clientSurname = $("#frelationClientSurname").val();
                            } 
                            else if (window.coach.get("role") == "NutritionExpert") 
                            {
                                clientVorname = $("#nrelationClientVorname").val();
                                clientSurname = $("#nrelationClientSurname").val();
                            } 
                            else 
                            {
                                clientVorname = $("#relationClientVorname").val();
                                clientSurname = $("#relationClientSurname").val();
                            }
                            
                            var temp = new CoachingRelation();
                            console.log(clientVorname);
                            temp.set({
                                clientEmail: clientEmail,
                                coachEmail: window.coach.get("email"),
                                relationType: type,
                                startDate: new Date().getTime(),
                                relationState: 0,
                                clientVorname: clientVorname,
                                clientSurname: clientSurname
                            });
                            var relations = new Firebase("https://intense-heat-7567.firebaseio.com/relations");
                            relations.push(temp.attributes);
                            $(this).dialog("close");
                        }
                    } 
                    else 
                    {
                        console.log(clientEmail);
                        $(".error-message").html(_.escape("Can not add client : Wrong Email")).show();
                    }
                
                },
                Cancel: function() {
                    $(this).dialog("close");
                    return;
                }
            },
            close: function(id) {
                return;
            }
        });*/
    }
});

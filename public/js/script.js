// Vue.component("likeapartial", {  component works more like a  partial
//     data: function() {
//         return {
//             name: ""
//         };
//     },
//     template: "<div><em>{{name}}</em><strong>{{name}}</strong></div>"
// });

(function() {
    new Vue({
        el: "#main", //el stands for element
        data: {
            images: [],
            currentImage: null,
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        }, //data ends here
        mounted: function() {
            var self = this;
            axios
                .get("/images")
                .then(function(response) {
                    console.log("response from server: ", response.data);
                    self.images = response.data;
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },
        //this function runs when html has loaded
        //but the Vue logic has't yet
        //we use mounted all the time!
        //it's good for making an ajax request to get data
        //(from an API or batabase etc) so the page can loaded
        //correctly
        // axios.get("/get-cities".then(function(resp) {}));

        methods: {
            handleFileChange: function(e) {
                // console.log("e in handlefile running", e);
                this.form.file = e.target.files[0]; // e.target.files[0] stores inside the data this.form.file
                // console.log("this: ", this);
            },
            showImage: function(imgid) {
                this.currentImage = imgid;
            },
            uploadFile: function(e) {
                //call preventDefault to tell button
                //not to reload the page
                e.preventDefault();
                var formData = new FormData();
                //formData is just for files
                //if we don't have file we don't need form data
                formData.append("file", this.form.file);
                formData.append("username", this.form.username);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                var the = this;
                axios
                    .post("/upload", formData)
                    .then(function(data) {
                        the.images.push(data, data[0]); //or unshift can also work in different way
                    })
                    .catch(err => {
                        console.log("error!", err);
                    });
            },
            hideImage: function() {
                this.currentImage = null;
            }
            //every function that runs in response
            //to an event
            //will be defined in the methods
            // myFn: function(e) {
            //     console.log("myfn's running", e);
            //     e.target.style.color = "tomato";
            //     e.target.style.fontSize = "50px";
            //     this.cities.push({
            //         name: "sasa",
            //         country: "JP" //this.cities[0].name="tokyo"
            //     });
            // } this part is demo
        }
    });
    Vue.component("popwindow", {
        props: ["id"],
        template: "#modal-template",
        data: function() {
            return {
                url: "",
                title: "",
                description: "",
                username: ""

                // comments: "",
                // form: {
                //     username: "",
                //     comments: ""
                // }
            };
        }, //data ends here
        mounted: function() {
            var self = this;
            axios.get("/images/" + self.id).then(function(data) {
                console.log("data", data);
                self.url = data.data[0].url;
                self.title = data.data[0].title;
                self.description = data.data[0].description;
                self.username = data.data[0].username;
            });
        }, //mounted ends here
        methods: {
            closeCompo: function() {
                this.$emit("hideimage");
            },
            insertCompo: function(e) {
                preventDefault(e);
                var self = this;
            }
        }
    });
})();

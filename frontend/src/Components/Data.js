export const Menu ={
    Superadmin:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"User", route:"/users"},
        {name:"Logout", logout: function(){localStorage.clear(); window.location.replace('/') }},
    ],
    Observer:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"Logout", logout: function(){localStorage.clear(); window.location.replace('/') }},
    ],
    Teacher:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"Logout", logout: function(){localStorage.clear(); window.location.replace('/') }},
    ]
}
import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../index'
import Login from '../login.vue'
import UserGroup from '../userGroup/UserGroup.vue';
//首页
import Domd from '../userGroup/Domd'


//预约管理
import List from '../AppointmentManagement/List.vue';
import Setup from '../AppointmentManagement/Setup.vue';
import Package from '../AppointmentManagement/Package.vue';
import Inspection from '../AppointmentManagement/Inspection.vue';
import CheckItems from '../AppointmentManagement/CheckItems.vue';


//系统设置
import Menu from "../user/Menu.vue";
import RoleList from '../user/RoleList.vue';
import Jurisdiction from '../user/Jurisdiction.vue';
import UserList from '../user/UserList.vue';

//患者管理
import SickItem from '../SickPerson/SickItem.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
    {
        path: '/index',
        name: '首页',
        component: index,
        children: [
            {
                name: '个人中心',
                path: 'userGroup',
                component:UserGroup
            },
            {
                name: '角色管理',
                path: 'userList',
                component: UserList
            },
            {
                name: '预约列表',
                path: 'list',
                component:List
            },
            {
                name: '预约设置',
                path: 'setup',
                component:Setup
            },
            {
                name: '套餐管理',
                path: 'package',
                component:Package
            },
            {
                name: '检查组管理',
                path: 'inspection',
                component:Inspection
            },
            {
                name: '检查项管理',
                path: 'checkitems',
                component:CheckItems
            },
            {
                name: '菜单管理',
                path: 'menu',
                component:Menu
            },
            {
                name: '权限管理',
                path: 'Jurisdiction',
                component:Jurisdiction
            },
            {
                name: '用户管理',
                path: 'RoleList',
                component:RoleList
            },
            {
                name: '会员档案',
                path: 'SickItem',
                component:SickItem
            },
            {
                name: '工具台',
                path: 'Domd',
                component:Domd
            }
        ]
    },
]

const router = new VueRouter({
  routes
})

export default router

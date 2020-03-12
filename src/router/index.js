import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Info from '@/pages/infoManagement'
import Fault from '@/pages/infoManagement/fault'
import Alarmcard from '@/pages/infoManagement/alarmcard'
import Login from '@/pages/login/index'
import Personnel from '@/pages/personnelManagement/index'
import Execution from '@/pages/regulationExecution'
import RegulationExecution from '@/pages/regulationExecution/execution'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
      // redirect: '/info'
      // children: [
      //   {
      //     path: '/info',
      //     name: 'Info',
      //     component: Info
      //   }
      // ]
    },
    {
      path: '/info',
      name: 'Info',
      component: Info
    },
    {
      path: '/fault',
      name: 'Fault',
      component: Fault
    },
    {
      path: '/execution',
      name: 'Execution',
      component: Execution
    },
    {
      path: '/regulationExecution',
      name: 'RegulationExecution',
      component: RegulationExecution
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/personnel',
      name: 'Personnel',
      component: Personnel
    },
    //  报警卡页面
    {
      path: '/alarmcard',
      name: 'Alarmcard',
      component: Alarmcard
    }
  ]
})

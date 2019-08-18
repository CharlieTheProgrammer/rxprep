<template>
  <div class="hello container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="topic-tab" data-toggle="tab" href="#topic" role="tab" aria-controls="topic" aria-selected="true">Topics</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="study-plan-tab" data-toggle="tab" href="#study-plan" role="tab" aria-controls="study-plan" aria-selected="false">Study Plan</a>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="topic" role="tabpanel" aria-labelledby="topic-tab">

        <div id="user-controls" class="d-flex justify-content-end my-3">
          <div id="search" class="mx-3">
            <input class="form-control form-control-sm" type="text" placeholder="Search" v-model="inputSearchTopic">
          </div>

          <div id="input-add-topic">
              <label class="sr-only" for="add-topic">Add Topic</label>
              <div class="input-group input-group-sm">
                <input
                  type="text"
                  class="form-control"
                  id="add-topic"
                  placeholder="Add Topic"
                  v-model="inputTopic"
                  v-on:keyup.enter="addTopicHandler(inputTopic)"
                >
                <div class="input-group-append">
                  <button
                    class="btn btn-primary"
                    @click="addTopicHandler(inputTopic)"
                    onclick="this.blur();" >+</button>
                </div>
              </div>
          </div>

        </div>

        <div class="d-flex align-items-center border border-secondary">
            <div class="col">Study Plan?  Topic</div>
            <!-- <div class="col">Topic</div> -->
            <!-- <div class="col">Actions</div> -->
        </div>
        <div id="topics-list" class="border border-secondary" style="min-height: 15vh; max-height: 50vh; overflow-y: scroll">
            <div
              data="topic-list-item" class="border d-flex align-items-center"
              v-for="topic in filteredTopics"
              :key="topic.id"
              >
              <div class="form-group form-check m-2">
                <input
                  :id="'topic-' + topic.id"
                  type="checkbox"
                  class="form-check-input"
                  v-model="topic.checked"
                  @change="topicCheckboxHandler(topic.id)"
                >
                <label class="form-check-label" :for="'topic-' + topic.id" >{{topic.name}}</label>
              </div>
              <div class="col text-right">
                <button class="btn btn-sm btn-warning" @click="deleteTopicHandler(topic.id)">Delete Topic</button>
              </div>
            </div>

        </div>
      </div>

      <div class="tab-pane fade " id="study-plan" role="tabpanel" aria-labelledby="study-plan-tab">

        <div id="user-controls" class="d-flex justify-content-end my-3">

          <div id="search" class="mx-3">
            <input class="form-control form-control-sm" type="text" placeholder="Search" v-model="inputSearchStudyPlan">
          </div>

          <div id="sort-date" class="dropdown">
            <a class="btn btn-sm btn-outline-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Date Sort By
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item" href="#" @click="order = 'asc'">Asc.</a>
              <a class="dropdown-item" href="#" @click="order = 'desc'">Desc.</a>
            </div>
          </div>

        </div>

        <div class="d-flex align-items-center border border-secondary">
            <div class="col">Topic</div>
            <div class="col">Study Date</div>
        </div>
        <!-- This is the non-table option  -->
        <div id="study-plan-list" class="border border-secondary" style="min-height: 15vh; max-height: 50vh; overflow-y: scroll">

          <div
            id="study-plan-list-item"
            class="border d-flex align-items-center"
            v-for="studyPlan in filteredStudyPlans"
            :key="studyPlan.id"
          >
            <div class="col">{{studyPlan.name}}</div>
            <div class="col" v-if="studyPlan.date">{{studyPlan.date | formatDate }}</div>
            <div class="col" v-else>Missing Study Date</div>
          </div>

        </div>
      </div>
    </div>

    <div>
      <b-modal
        id="study-plan-datepicker"
        title="Study Date"
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
        ok-only
        >
        <template slot="modal-footer">
          <button class="btn btn-primary" @click="addTopicToStudyPlansHandler(topicLastChecked)">OK</button>
        </template>

        <div class="mb-2 text-center text-danger">
          <p>{{ datepicker.errorMsg }}</p>
        </div>
        <div class="mb-2 text-center text-success">
          <p>{{ datepicker.successMsg }}</p>
        </div>
        <Datepicker
          placeholder="Select your planned study date"
          calendar-class="mx-auto position-relative"
          wrapper-class="text-center mx-auto"
          inline
          v-model="datepicker.selectedDate"
          :disabled-dates="datepicker.config.disabledDates"
          />
      </b-modal>
    </div>

  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  components: {
    Datepicker
  },

  data() {
    return {
      inputTopic: "",
      inputSearchTopic: "",
      inputSearchStudyPlan: "",
      topics: [],
      studyPlans: [],
      topicLastChecked: {},
      datepicker: {
        selectedDate: '',
        errorMsg: '',
        successMsg: '',
        config: {
          disabledDates: {
            to: new Date(), // Disable all dates up to today
          }
        }
      },
      order: 'asc'
    }
  },
  filters:{
    formatDate(isoDate) {
      if (!isoDate) return null

      let date = new Date(isoDate)
      let month = date.getMonth() + 1
      let day = date.getDate()
      let year = date.getFullYear()

      return month + '-' + day + '-' + year
    }
  },
  computed: {
    filteredTopics() {
      return this.topics.filter(topic => {
        return topic.name.toLowerCase().includes(this.inputSearchTopic.toLowerCase())
      })
    },
    filteredStudyPlans() {
      return this.studyPlans.filter(studyPlan => {
        return studyPlan.name.toLowerCase().includes(this.inputSearchStudyPlan.toLowerCase())
      }).sort(this.sortStudyPlans())
    }
  },
  created() {
    this.topics = JSON.parse(localStorage.getItem('topics')) || []
    this.studyPlans = JSON.parse(localStorage.getItem('studyPlans')) || []
  },
  methods: {
    sortStudyPlans() {
      if (this.order === 'asc') {
        return (a, b) => new Date(a.date) - new Date(b.date)
      } else {
        return (a, b) => new Date(b.date) - new Date(a.date)
      }
    },
    // Controllers
    topicCheckboxHandler(topicId) {
      const topic = this.getTopic(topicId)
      if (!topic) throw Error("Topic not found")
      if (topic.checked) {
        this.openDatePicker('study-plan-datepicker')
        this.topicLastChecked = {...topic}
      } else {
        this.deleteStudyPlan(topicId)
      }
    },

    addTopicHandler(topicName) {
      if (!topicName) return

      const topic = {
          name: topicName,
          checked: false
      }

      this.addTopic(topic)
      this.inputTopic = ""
    },


    deleteTopicHandler(topicId) {
      const topic = this.getTopic(topicId)

      if (window.confirm(`Are you sure want to delete ${topic.name}?`)) {
        this.deleteTopic(topicId)
        this.deleteStudyPlan(topicId)
      }
    },

    addTopicToStudyPlansHandler(topic) {
      const selectedDate = this.getDatepickerDate()
      // this.openDatePicker('study-plan-datepicker')

      if (!selectedDate) {
        this.setDatepickerError("Please select a date.")
      } else {
        topic.date = this.getDatepickerDate()
        this.addStudyPlan(topic)
        this.setDatepickerError("")
        this.setDatepickerDate("")

        this.setDatepickerMessage("Topic has been successfully added to study plan!")
        setTimeout(()=>{
          this.setDatepickerMessage("")
        this.closeDatePicker('study-plan-datepicker')
        }, 1500)
      }
    },

    openDatePicker(datePickerId) {
      this.$bvModal.show('study-plan-datepicker')
    },

    closeDatePicker(datePickerId) {
      this.$bvModal.hide('study-plan-datepicker')
    },

    filterTopics(inputSearch) {
      return this.topics.filter(topic => topic.name.toLowerCase().includes(inputSearch.toLowerCase()))
    },

    // Models
    setDatepickerDate(date) {
      this.datepicker.selectedDate = date
    },

    setDatepickerError(errorMsg) {
      this.datepicker.errorMsg = errorMsg
    },

    setDatepickerMessage(msg) {
      this.datepicker.successMsg = msg
    },

    getDatepickerDate() {
      return this.datepicker.selectedDate
    },

    addStudyPlan(studyPlan) {
        this.studyPlans.push(studyPlan)
        // this.topicLastChecked = {} This is a detail that should be handled by the controller
    },

    deleteStudyPlan(studyPlanId) {
      this.studyPlans = this.studyPlans.filter(studyPlan => studyPlan.id != studyPlanId)
    },

    getStudyPlan(studyPlanId) {
      return this.studyPlans.filter(studyPlan => studyPlan.id == studyPlanId)
    },

    getStudyPlans() {
      return this.studyPlans
    },

    addTopic(topic) {
      if (!topic) return
      topic.id = this.generateUUID()
      this.topics.push(topic)
    },

    deleteTopic(topicId) {
      this.topics = this.topics.filter(topic => topic.id != topicId)
    },

    getTopic(topicId) {
      return this.topics.find(topic => topic.id == topicId)
    },

    getTopics() {
      return this.topics
    },

    // Utils
    generateUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });

        return uuid;
    }
  },
  watch: {
    topics: {
      handler(val) {
        localStorage.setItem('topics', JSON.stringify(val))
      },
      deep: true
    },
    studyPlans: {
      handler(val) {
        localStorage.setItem('studyPlans', JSON.stringify(val))
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #study-plan-list-item:nth-child(odd) {
    background: #eee
  }
</style>

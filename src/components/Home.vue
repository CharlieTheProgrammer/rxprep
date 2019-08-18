<template>
  <div class="container">
    <h1 class="display-4 mb-4">{{ msg }}</h1>

    <b-card>
      <b-tabs content-class="mt-3">
        <b-tab title="Topics" active>
          <div id="user-controls-topics" class="d-flex justify-content-end my-3">
            <div id="search" class="mx-3">
              <input
                class="form-control form-control-sm"
                type="text"
                placeholder="Search"
                v-model="inputSearchTopic"
              />
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
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-primary"
                    @click="addTopicHandler(inputTopic)"
                    onclick="this.blur();"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-secondary">
            <div class="col">Topic</div>
          </div>

          <div
            id="topics-list"
            class="border border-secondary"
            style="min-height: 200px; max-height: 50vh; overflow-y: auto"
          >
            <div
              :id="'topic-' + topic.id"
              class="border d-flex align-items-center"
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
                />
                <label class="form-check-label" :for="'topic-' + topic.id">{{topic.name}}</label>
              </div>
              <div class="col text-right">
                <button
                  class="btn btn-sm btn-warning"
                  @click="deleteTopicHandler(topic.id)"
                >Delete Topic</button>
              </div>
            </div>
          </div>
          <small>
            <strong>* Check the box to set a study date.</strong>
          </small>
        </b-tab>

        <b-tab title="Study Plan">
          <div
            id="user-controls-study-plans"
            class="d-flex justify-content-end align-items-center my-3"
          >
            <div id="search-study-plan" class="mx-3">
              <input
                class="form-control form-control-sm"
                type="text"
                placeholder="Search"
                v-model="inputSearchStudyPlan"
              />
            </div>

            <div>
              <b-dropdown
                id="dropdown-1"
                text="Date Sort By"
                class
                size="sm"
                variant="outline-secondary"
              >
                <b-dropdown-item :active="order == 'asc' ? true : false" @click="order = 'asc'">Asc.</b-dropdown-item>
                <b-dropdown-item
                  :active="order == 'desc' ? true : false"
                  @click="order = 'desc'"
                >Desc.</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>

          <div class="d-flex align-items-center border border-secondary">
            <div class="col">Topic</div>
            <div class="col">Study Date</div>
          </div>
          <div
            id="study-plan-list"
            class="border border-secondary"
            style="min-height: 200px; max-height: 50vh;"
          >
            <div
              :id="'study-plan-' + studyPlan.id"
              class="border d-flex align-items-center py-2"
              v-for="studyPlan in filteredStudyPlans"
              :key="studyPlan.id"
            >
              <div class="col">{{studyPlan.name}}</div>
              <div class="col" v-if="studyPlan.date">{{studyPlan.date | formatDate }}</div>
              <div class="col" v-else>Missing Study Date</div>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>

    <div>
      <b-modal
        id="study-plan-datepicker"
        title="Add Your Study Date"
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
          wrapper-class="mx-auto"
          inline
          v-model="datepicker.selectedDate"
          :disabled-dates="datepicker.config.disabledDates"
        />
      </b-modal>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { setTimeout } from "timers";

export default {
  components: {
    Datepicker
  },
  props: ["msg"],
  data() {
    return {
      inputTopic: "",
      inputSearchTopic: "",
      inputSearchStudyPlan: "",
      topics: [],
      studyPlans: [],
      topicLastChecked: {},
      datepicker: {
        selectedDate: "",
        errorMsg: "",
        successMsg: "",
        config: {
          disabledDates: {
            to: new Date() // Disable all dates up to today
          }
        }
      },
      order: "asc"
    };
  },
  filters: {
    formatDate(isoDate) {
      if (!isoDate) return null;

      let date = new Date(isoDate);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();

      return month + "-" + day + "-" + year;
    }
  },
  computed: {
    filteredTopics() {
      return this.topics.filter(topic => {
        return topic.name
          .toLowerCase()
          .includes(this.inputSearchTopic.toLowerCase());
      });
    },
    filteredStudyPlans() {
      return this.studyPlans
        .filter(studyPlan => {
          return studyPlan.name
            .toLowerCase()
            .includes(this.inputSearchStudyPlan.toLowerCase());
        })
        .sort(this.sortStudyPlans());
    }
  },
  created() {
    this.topics = JSON.parse(localStorage.getItem("topics")) || [];
    this.studyPlans = JSON.parse(localStorage.getItem("studyPlans")) || [];
  },
  methods: {
    // Controllers
    topicCheckboxHandler(topicId) {
      const topic = this.getTopic(topicId);
      if (!topic) throw Error("Topic not found");
      if (topic.checked) {
        this.openDatePicker("study-plan-datepicker");
        this.topicLastChecked = { ...topic };
      } else {
        this.deleteStudyPlan(topicId);
      }
    },

    addTopicHandler(topicName) {
      if (!topicName) return;

      const topic = {
        name: topicName,
        checked: false
      };

      this.addTopic(topic);
      this.inputTopic = "";
    },

    deleteTopicHandler(topicId) {
      const topic = this.getTopic(topicId);

      if (window.confirm(`Are you sure want to delete ${topic.name}?`)) {
        this.deleteTopic(topicId);
        this.deleteStudyPlan(topicId);
      }
    },

    addTopicToStudyPlansHandler(topic) {
      const selectedDate = this.getDatepickerDate();

      if (!selectedDate) {
        this.setDatepickerError("Please select a date.");
      } else {
        const date = this.getDatepickerDate();
        const { id, name } = topic;
        this.addStudyPlan({
          id,
          name,
          date
        });
        this.setDatepickerError("");
        this.setDatepickerDate("");

        this.setDatepickerMessage(
          "Topic has been successfully added to study plan!"
        );
        setTimeout(() => {
          this.setDatepickerMessage("");
          this.closeDatePicker("study-plan-datepicker"); 
        }, 1500);
      }
    },


    // Models
    setDatepickerDate(date) {
      this.datepicker.selectedDate = date;
    },

    setDatepickerError(errorMsg) {
      this.datepicker.errorMsg = errorMsg;
    },

    setDatepickerMessage(msg) {
      this.datepicker.successMsg = msg;
    },

    getDatepickerDate() {
      return this.datepicker.selectedDate;
    },

    addStudyPlan(studyPlan) {
      this.studyPlans.push(studyPlan);
    },

    deleteStudyPlan(studyPlanId) {
      this.studyPlans = this.studyPlans.filter(
        studyPlan => studyPlan.id != studyPlanId
      );
    },

    getStudyPlan(studyPlanId) {
      return this.studyPlans.filter(studyPlan => studyPlan.id == studyPlanId);
    },

    getStudyPlans() {
      return this.studyPlans;
    },

    addTopic(topic) {
      if (!topic) return;
      topic.id = this.generateUUID();
      this.topics.push(topic);
    },

    deleteTopic(topicId) {
      this.topics = this.topics.filter(topic => topic.id != topicId);
    },

    getTopic(topicId) {
      return this.topics.find(topic => topic.id == topicId);
    },

    getTopics() {
      return this.topics;
    },

    // Utils
    generateUUID() {
      var dt = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );

      return uuid;
    },

    sortStudyPlans() {
      if (this.order === "asc") {
        return (a, b) => new Date(a.date) - new Date(b.date);
      } else {
        return (a, b) => new Date(b.date) - new Date(a.date);
      }
    },

    openDatePicker(datePickerId) {
      this.$bvModal.show(datePickerId);
    },

    closeDatePicker(datePickerId) {
      this.$bvModal.hide(datePickerId);
    }
  },
  watch: {
    topics: {
      handler(val) {
        localStorage.setItem("topics", JSON.stringify(val));
      },
      deep: true
    },
    studyPlans: {
      handler(val) {
        localStorage.setItem("studyPlans", JSON.stringify(val));
      },
      deep: true
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#study-plan-list > div:nth-child(odd),
#topics-list > div:nth-child(odd) {
  background: #eee;
}
</style>

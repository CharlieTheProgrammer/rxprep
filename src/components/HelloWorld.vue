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
            <input class="form-control form-control-sm" type="text" placeholder="Search">
          </div>

          <div id="input-add-topic">
              <label class="sr-only" for="add-topic">Add Topic</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" id="add-topic" placeholder="Add Topic">
                <div class="input-group-append">
                  <button class="btn btn-primary">+</button>
                </div>
              </div>
          </div>

        </div>

        <div id="topics-list">
          <div class="border border-secondary" style="min-height: 15vh; max-height: 20vh; overflow-y: scroll">

            <div id="topic-list-item" class="border d-flex align-items-center">
              <div class="form-group form-check m-2">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Topic</label>
              </div>
              <div class="col text-right">
                <button class="btn btn-sm btn-warning">Delete Topic</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="tab-pane fade " id="study-plan" role="tabpanel" aria-labelledby="study-plan-tab">

        <div id="user-controls" class="d-flex justify-content-end my-3">

          <div id="search" class="mx-3">
            <input class="form-control form-control-sm" type="text" placeholder="Search">
          </div>

          <div id="sort-date" class="dropdown">
            <a class="btn btn-sm btn-outline-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Date Sort By
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <a class="dropdown-item" href="#">Asc.</a>
              <a class="dropdown-item" href="#">Desc.</a>
            </div>
          </div>

        </div>

        <!-- This is the non-table option  -->
        <div id="study-plan-list" class="border border-secondary" style="min-height: 15vh; max-height: 20vh; overflow-y: scroll">

          <div id="study-plan-list-item" class="border d-flex align-items-center">
            <div class="col">Topic Name</div>
            <div class="col">Topic Date 01/01/2020</div>
          </div>

          <div id="study-plan-list-item" class="border d-flex align-items-center">
            <div class="col">Topic Name</div>
            <div class="col">Topic Date 01/01/2020</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #study-plan-list-item:nth-child(odd) {
    background: #eee
}
</style>

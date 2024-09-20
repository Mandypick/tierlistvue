import { ref, reactive} from 'vue'

const colors = [
    '#FF8A8A',
    '#F4DEB3',
    '#F0EAAC',
    '#CCE0AC',
    '#CEDF9F',
    "#A1D6B2"
]

let images = reactive([])

let lists = reactive([
    {"id":1,"title":"S","color":colors[0],"items":[]},
    {"id":2,"title":"A","color":colors[1],"items":[]},
    {"id":3,"title":"B","color":colors[2],"items":[]},
    {"id":4,"title":"C","color":colors[3],"items":[]},
    {"id":5,"title":"D","color":colors[4],"items":[]},
    {"id":6,"title":"E","color":colors[5],"items":[]}
])

export{
    lists,
    colors,
    images
}
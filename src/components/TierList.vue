<template>
<div id="container" class="w-full mt-10" >
    <section class="mx-auto w-5/6 divide-y">
        <p>Categorias - Cree una clasificación de imagenes por categoría</p>
    </section>
    <section class="mx-auto w-5/6 divide-y divide-gray-700 border border-gray-400">
        <div :key="index+'key-tier'" v-for="(list,index) in lists" class="">
            <section class="bg-gray-900 flex justify-between">
                <!-- Título -->
                <div :style="`background-color:${list.color}`" class="max-w-40 min-h-28 truncate text-wrap px-0.5 w-full h-auto flex items-center justify-center">
                    <input @blur="resetEditItem" :id="'lisId-'+list.id" v-if=" editItem.id === list.id" placeholder="Categoría" @keyup.enter="editName(index)" class="text-white text-decorate placeholder-slate-100 font-medium text-lg w-32  bg-transparent opacity-70 text-center" type="text" v-model="editItem.title"/>
                    <p v-else @click="setEditItem(list)" class="text-white text-decorate cursor-pointer font-medium text-xl w-full bg-transparent text-center"> {{list.title || '#'}} </p>
                </div>
                <!-- Imagenes -->
                <div @dragenter="(e)=>onDropRow(e,index)" @dragleave="(e)=>onLeaveRow(e,index)" class="w-full flex flex-wrap content-start">
                    <img
                        v-for="(image,_index) in list.items" 
                        @dragstart="(e)=>onDragStart(e,index,_index,image)" 
                        @dragend="(e)=>onDragEnd(e,index,_index,image)"
                        class="w-28 h-28 cursor-grab object-cover rounded border border-white"
                        draggable="true"
                        :key="_index+'key-image-tier'" 
                        :src="image.data"
                        alt="image"
                    />
                </div>
                <!-- Opciones -->
                <div class="w-24 h-auto border-l border-gray-700 bg-gray-900 flex items-center px-0.5">
                    <div class="">
                        <button title="Subir categoría" class="hover:bg-gray-700 rounded" @click="toUpRow(list,index)">
                            <img class="h-8 w-10" src="@/assets/up-arrow-svgrepo-com.svg">
                        </button>
                        <button title="Bajar categoría" class="hover:bg-gray-700 rounded" @click="toDownRow(list,index)">
                            <img class="transform rotate-180 h-8 w-10" src="@/assets/up-arrow-svgrepo-com.svg">
                        </button>
                    </div>
                    <div>
                        <button title="Cambiar color" class="hover:bg-gray-700 rounded relative">
                            <label class="relative">
                                <img title="Cambiar color" class="cursor-pointer h-6 w-10" src="@/assets/brush-svgrepo-com.svg">
                                <input type="color" class="absolute opacity-0 w-full shink-0"  @change="(e)=>colorPicker(e,list)" id="colorPicker" :value="list.color" />
                            </label>
                        </button>
                        <button class="hover:bg-gray-700 rounded" @click="deleteRow(index)">
                            <img title="Eliminar categoría" class="h-8 w-10 opacity-70" src="@/assets/trash-svgrepo-com.svg">
                        </button>
                    </div>
                </div>
            </section>
        </div>
        <!-- Añadir categoría -->
        <div>
            <button title="Añadir categoría" @click="addCategory" class="w-full cursor-pointer hover:bg-gray-700 h-12 items-center flex justify-center">
                <div class="inline-flex space-x-2">
                    <img class="mx-auto h-8 w-8" src="@/assets/add-circle-svgrepo-com.svg">
                    <p class="mt-1">Añadir otra categoría</p>
                </div>
            </button>
        </div>   
    </section>

    <!-- botones -->
    <section class="w-full flex p-5 justify-center space-x-24 items-center">
        <button @click="addImage" title="Añadir imagen" class="cursor-pointer w-10 h-10 bg-gray-800 hoverbg-gray-700 rounded">
            <div class="inline-flex space-x-2">
                <img class="mx-auto h-8 w-8" src="@/assets/add-circle-svgrepo-com.svg">
                <p class="mt-1 leading-3">Añadir imagenes</p>
            </div>

        </button>
        <button @click="resetCategories" title="restablecer categorias" class="cursor-pointer w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded">
            <div  class="inline-flex space-x-2">
                <img class="mx-auto h-8 w-8" src="@/assets/reset-svgrepo-com.svg">
                <p class="mt-1">Restablecer</p>
            </div>

        </button>
    </section>

    <!-- Imagenes -->
    <section class="mx-auto w-5/6 divide-y">
        <p>Listado de imagenes - Arrastre una imagen hasta la categoría deseada!</p>
    </section>
    <section id="list-images" @dragenter="(e)=>onDropRow(e,null)" @dragleave="(e)=>onLeaveRow(e,null)" class="mb-10 mx-auto min-h-[300px] w-5/6 flex flex-wrap content-start divide-y divide-gray-700 border border-gray-400">
        <img 
            draggable="true" 
            v-for="(image,index) in imagesComputed"
            @dragstart="(e)=>onDragStart(e,null,index,image)"
            @dragend="(e)=>onDragEnd(e,null,index,image)"
            :key="index+'-key-image-list'"
            :src="image.data"
            class="w-28 cursor-grab object-cover h-28 rounded border border-white"
        >
    </section>
</div>    
</template>

<script lang="js">
import { defineComponent, reactive,ref,computed,watch, nextTick } from 'vue'
import { lists, colors, images } from './TierListComposer.js'
export default defineComponent({
    name:"TierList",
    setup(pros,{emit}){

        const editItem = ref({})

        const formatImages = ["image/png","image/svg+xml","image/jpeg"]
        let containerDestiny = null
        let containerOrigin = null
        
        const addCategory = ()=>{
            if(lists.length > 20){
                alert("Hasta 20 categorías")
                return
            }
            const countId = lists.length ? lists.toSorted((a,b)=>a.id-b.id)[lists.length-1].id +1 : 1
            lists.push({"id": countId,"title":"","color":colors[0],"items":[]})
        }

        const toUpRow = (list,index)=>{
            if(index === 0) return
            lists.splice(index,1)
            lists.splice(index-1,0,list)
        }

        const toDownRow = (list,index)=>{
            if(index === lists.length-1) return
            lists.splice(index,1)
            lists.splice(index+1,0,list)
        }

        const deleteRow = (index)=>{
            lists.splice(index,1)
        }

        const editName = (index)=>{
            lists.splice(index,1,editItem.value)
            resetEditItem()
        }

        const addImage = async()=>{
         
            try{
                const _options = {
                    "startIn":"downloads",
                    "multiple": true,
                    "mode":"read",
                    "types": [{"accept":{"image/png":[".png"],"image/svg+xml":[".svg"],"image/jpeg":[".jpg",".jpeg"]}}],
                    "excludeAcceptAllOption": true
                }
    
                const _events = await window.showOpenFilePicker(_options)
                
                for (let index = 0; index < _events.length; index++) {
                    const _event = _events[index]
                    
                    const _file = await _event.getFile()
                    // validar archivo
                    if(_file && !formatImages.some((f)=>f==_file.type) && (_file.size >= 1048579)){
                        alert("Seleccione una imagen con peso menor o igual a 1Mb. tipo .png, .svg, .jpg, .jpeg")
                        return
                    }

                    const reader = new FileReader()
                    reader.readAsDataURL(_file)
                    reader.onload = (eventReader)=>{
                        const countId = images.length ? images.toSorted((a,b)=>a.id-b.id)[images.length-1].id +1 : 1
                        images.push({"id":countId,"show":true,"data":eventReader.target.result})
                    }

                }

            }catch(e){
                console.log(e)
            }
            
        }

        const onDragStart = (e,tier,indexImage,image)=>{
            containerOrigin = {"tier":tier,"indexImage":indexImage,"image":image}
        }

        const onDragEnd = (e,tier,indexImage,image)=>{
            const params = {tier,indexImage,image}

            //console.log("origen",containerOrigin)
            //console.log("destino",containerDestiny)
            //console.log("parametros",params)

            // si existe tier y es diferente
            if(containerDestiny.tier != null && containerDestiny.tier >= 0){
                if(containerDestiny.tier != containerOrigin.tier){
                    lists[containerDestiny.tier].items.push(params.image)
                }else{
                    return
                }
            }

            if(containerOrigin.tier != null && containerOrigin.tier >= 0){
                lists[containerOrigin.tier].items.splice(containerOrigin.indexImage,1)
            }else{
                images.splice(containerOrigin.indexImage,1)
            }

            if(containerOrigin.tier >= 0 && containerDestiny.tier === null){
                images.push(params.image)
            }
        }

        const resetEditItem =()=>editItem.value = {}

        const setEditItem =(object)=>{
            editItem.value = object
            setTimeout(() => {
                document.getElementById('lisId-'+object.id).focus()
            },300)
        }

        const onDropRow =(e,tier)=>{
            e.preventDefault()
            containerDestiny = {"tier":tier,"indexImage":null,"image":null}
        }

        const onLeaveRow =(e)=>{
            e.preventDefault()
        }

        const resetCategories =()=>{
            lists.forEach(category => {
                images.push(...category.items)
                category.items = []
            })
        }

        const colorPicker = (e,list)=>{
            list.color = e.target.value
        }

        //computed
        const imagesComputed = computed(()=>images)

        //watch
        watch(editItem,(newvalue,oldvalue)=>{
            // 
        })

        return{
            editItem,
            lists,
            images,
            imagesComputed,
            colors,
            addImage,
            addCategory,
            toUpRow,
            toDownRow,
            deleteRow,
            onDragStart,
            onDragEnd,
            editName,
            resetEditItem,
            setEditItem,
            onDropRow,
            onLeaveRow,
            resetCategories,
            colorPicker
        }
    },
    mounted(){
        nextTick(()=>{
            
        })
        
    }
})
</script>

<style scoped>
    .text-decorate {
        text-shadow: 0 0 2px #000000, 0 0 5px #000000;
    }
</style>
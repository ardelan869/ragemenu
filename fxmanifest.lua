fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'ardelan869'
description 'FiveM native Rage Menu, made with React'

ui_page 'web/dist/index.html'
file 'web/dist/**'

client_script {
  'import.lua',
  'client/main.lua'
}

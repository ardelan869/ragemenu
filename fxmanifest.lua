fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'ardelan869'
version 'fix(web): fix colors and word break'
description 'FiveM native Rage Menu, made with React'

ui_page 'web/dist/index.html'
file 'web/dist/**'

client_script {
  'client/main.lua',
  'import.lua'
}

server_script 'server/version.lua'

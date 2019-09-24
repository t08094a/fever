#!/usr/bin/env python3

""" Actions to execute for this project """

""" 
Requirements: 
    pip3 install inquirer
    pip3 install colorama
"""

import inquirer
import subprocess
import colorama
from colorama import Fore, Back, Style, init
import os
import io
import configparser

init(autoreset=True)

settings_file_name = '.local_settings.ini'

build_docker_image = 'Build Docker Image'
create_app = 'Erzeuge App Template'
cancel = 'Abbruch'

def write_content_to_local_settings(section, key, value):
    """
    Writes a key value pair to a specific section in the local settings file

    :param section: The section to write the key value pair into
    :param key: The key of the key value pair
    :param value: The value of the key value pair
    """

    config = configparser.ConfigParser()
    config.read(settings_file_name)

    if(not config.has_section(section)):
        config.add_section(section)
    
    config[section][key] = value
    
    with open(settings_file_name, 'w') as configfile:
        config.write(configfile)

def read_content_from_local_settings(section, key):
    config = configparser.ConfigParser()
    config.read(settings_file_name)

    value = config.get(section, key, fallback=None)
    return value


def action_build_docker_image():
    print(build_docker_image)

    # DOCKER_BUILDKIT=1
    os.environ['DOCKER_BUILDKIT'] = "1" # visible in this process + all children

    questions = [
        inquirer.Text('name', message='Welchen Namen soll der Build erhalten?', default='t08094a/ionic'),
        inquirer.Text('version', message='Welche Version soll der Build erhalten?', default='1.0.0'),
        inquirer.Confirm('latest', message='Soll mit \'latest\' geflagt werden?', default=True)
    ]

    answers = inquirer.prompt(questions)
    
    name = answers['name']
    version = answers['version']
    latest = answers['latest']

    # save the image name in an invisible file
    write_content_to_local_settings('Docker', 'image_name', name)

    cmd = [
        'docker', 'build',
        '-t', name + ':' + version
    ]

    if(latest):
        cmd.extend(['-t', name + ':latest'])

    cmd.extend(['.'])
    
    # z.B. docker build -t t08094a/ionic:1.0.0 -t t08094a/ionic:latest .
    print(Fore.CYAN + 'call: ' + ' '.join(cmd) + '\n')
    completed = subprocess.run(cmd)


def action_create_app():
    print(create_app)

    image_name = read_content_from_local_settings('Docker', 'image_name')
    
    docker_image_args = ['docker', 'images', '--format', '\"table {{.Repository}}||{{.Tag}}\"']

    if(image_name):
        docker_image_args.extend(['--filter=reference=\'' + image_name + '\''])
    
    completed = subprocess.run(' '.join(docker_image_args), shell=True, stdout=subprocess.PIPE, universal_newlines=True, check=True)
    lines = str(completed.stdout).splitlines()[1::]
    items = [n.split('||') for n in lines]
    items = [':'.join(n) for n in items]
        
    questions = [inquirer.Text('app_name', message='Welchen Namen soll die App erhalten?', validate=True)]

    if(len(items) > 1):
        questions.append(inquirer.List('image', message='Welches Image soll zur Ausführung verwendet werden?', choices=items, default=items[0]))

    answers = inquirer.prompt(questions)
    app_name = answers['app_name']
    image = answers['image']

    cmd = 'docker run --rm --volume `pwd`:/dev/ -it ' + image + ' ionic start ' + app_name + './ sidemenu'
    print(Fore.CYAN + 'call: ' + cmd)
    completed = subprocess.run(cmd, shell=True)

    


def action_cancel():
    # do nothing
    pass


if __name__ == '__main__':

    options = {
        build_docker_image : action_build_docker_image,
        create_app : action_create_app,
        cancel : action_cancel
    }

    questions = [
        inquirer.List('selection',
                      message="Welche Aktion soll ausgeführt werden?",
                      choices=options.keys())
    ]

    answer = inquirer.prompt(questions)
    target = answer['selection']

    options[target]()

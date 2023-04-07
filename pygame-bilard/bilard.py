from settings import radius, size, pg
from bilardClasses import Wall, Hole, Ball, Poly, Cue
import math

pg.display.init()
screen = pg.display.set_mode((round(400 * size), round(800 * size)))
cos = math.cos(math.radians(30)) * radius * 2  # distance between balls on y after applying cosine

brown = (101, 67, 33)
gray = (120, 120, 120)
dark_green = (10, 60, 42)

# initialise geometry
walls = [Wall(0, 0, 400, 33, gray),
         Wall(0, 767, 400, 800, gray),
         Wall(0, 0, 33, 800, gray),
         Wall(367, 0, 33, 800, gray),
         Wall(66, 0, 268, 33, brown),
         Wall(66, 767, 268, 800, brown),
         Wall(0, 66, 33, 301, brown),
         Wall(0, 433, 33, 301, brown),
         Wall(367, 66, 33, 301, brown),
         Wall(367, 433, 33, 301, brown)]

holes = [Hole(33, 33, 22),
         Hole(367, 33, 22),
         Hole(367, 767, 22),
         Hole(33, 767, 22),
         Hole(22, 400, 22),
         Hole(378, 400, 22)]

balls = [Ball(200, 600, (255, 255, 255)),  # white
         Ball(200, 200, (255, 255, 0)),  # yellow
         Ball(200 + radius, 200 - cos, (0, 0, 255)),  # blue
         Ball(200 - radius, 200 - cos, (255, 0, 0)),  # red
         Ball(200 - radius * 2, 200 - cos * 2, (138, 43, 226)),  # purple
         Ball(200 + radius * 2, 200 - cos * 2, (0, 255, 0)),  # green
         Ball(200, 200 - cos * 2, (0, 0, 0)),  # black
         Ball(200 - radius * 3, 200 - cos * 3, (128, 0, 0)),  # maroon     ---striped---
         # Ball(200-radius*1,200- cos * 3, (255, 200, 50)),  # yellow
         # Ball(200+radius*1,200- cos * 3, (0, 0, 255)),  # blue
         # Ball(200+radius*3,200- cos * 3, (255, 0, 0)),  # red
         # Ball(200+radius*3,200- cos * 3, (255, 0, 0)),
         ]

bumpers = [Poly(((33, 55), (46, 69), (46, 367), (33, 380)), dark_green),
           Poly(((33, 420), (46, 433), (46, 731), (33, 745)), dark_green),
           Poly(((367, 55), (354, 69), (354, 367), (367, 380)), dark_green),
           Poly(((367, 420), (354, 433), (354, 731), (367, 745)), dark_green),
           Poly(((55, 33), (69, 46), (331, 46), (345, 33)), dark_green),
           Poly(((55, 767), (69, 754), (331, 754), (345, 767)), dark_green)]

cue = Cue()
while 1:
    for event in pg.event.get():
        if event.type == pg.QUIT:
            pg.quit()
    screen.fill((10, 108, 3))
    # borders
    for x in walls:
        x.draw()
    # holes
    for x in holes:
        x.draw()
    # balls
    for x in balls:
        if x.moving:  # other balls can wake it up
            if x.interactHoles(holes):  # detect holes
                if x.c == (255, 255, 255):
                    x.reset()
                    x.vel.fill(0)
                else:
                    balls.remove(x)
            x.collideBumpers(bumpers)  # collision check
            if x.moving:
                x.collideBalls(balls)
        x.draw()
    # bumpers
    for x in bumpers:
        x.draw()
    for b in balls:
        if b.moving:
            cue.active = False
            break
        cue.active = True
    if cue.active:
        cue.update(balls[0])  # pass white ball to cue
        cue.draw()
    pg.display.flip()

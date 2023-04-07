import pygame,sys,math,random
pygame.init()

class settings:
    def __init__(self,size,gridSize,margin):
        self.size = size
        self.gridSize = gridSize
        self.margin = margin
        self.counter=4000

sett = settings(400,10,20)

class game:
    def __init__(self,settings):
        self.board = [""]*settings.gridSize
        self.target = 0
        self.curPlayer = self.returnPlr(random.randrange(2))
        self.winCondition = 4
        self.win = 0

    def returnPlr(self,n):
        if n==2:
            return "x" if self.curPlayer=="o" else "o"
        return "x" if n == 0 else "o"
    def getPiece(self,x,y):
        if y>len(self.board[x])-1 or self.board[x]=="":
            return " "
        else:
            return self.board[x][y]
game=game(sett)

screen = pygame.display.set_mode((int(sett.size*1.4),sett.size) )
font = pygame.font.SysFont("arial", sett.size//15)

class leet:
    def __init__(self, t, x,y):
        self.txt = font.render(t, True, (23, 34, 45))
        self.pos = pygame.Vector2(x, y)

def drawPointer():
    pygame.draw.arc(screen,(150,80,0),[sett.margin*1.3+game.target*sett.size*0.92/sett.gridSize,0,sett.size/20,sett.size/20],0,math.pi*2)

def checkWin(game,x,y):
    strings=[""]*4
    #row
    for i in range(sett.gridSize):
        strings[0]+=game.getPiece(i,y)
    #column
    strings[1]=game.board[x]
    #diagonal1
    startx=x-y
    starty=0
    for i in range(0,sett.gridSize-startx):
        strings[2]+=game.getPiece(startx+i,starty+i)
    #diagonal2
    startx=x+y
    for i in range(0,sett.gridSize-startx):
        strings[3]+=game.getPiece(startx-i,starty+i)
    for s in strings:
        if s.count(game.board[x][y]*game.winCondition):
            game.win=1
            return 1
    return 0

def handle():
    k=pygame.key.get_pressed()
    if k[pygame.K_SPACE]:
        runGame()
    if k[pygame.K_LEFT]:
        game.target-=1
    elif k[pygame.K_RIGHT]:
        game.target+=1

def drawPieces():
    for row,x in enumerate(game.board):
        for stack,char in enumerate(x):
            temp = leet(char,sett.margin+sett.gridSize+row*sett.size*0.92/sett.gridSize,(sett.size*0.875)-stack*sett.size*0.92/sett.gridSize)
            screen.blit(temp.txt, [temp.pos[0], temp.pos[1]])

def dropPiece(player,column):
    if game.board[column]=="":
        game.board[column]=player
    else:
        game.board[column]+=player

def drawGrid(count):
    for x in range(count):
        pygame.draw.line(screen ,(0,0,0),(sett.margin+x*sett.size/count,sett.margin),(sett.margin+x*sett.size/count,sett.size-sett.margin))
        pygame.draw.line(screen,(0,0,0),(sett.margin,sett.margin+x*sett.size/count),(sett.size-sett.margin,sett.margin+x*sett.size/count))

def runGame():
    if len(game.board[game.target])<sett.gridSize:
        dropPiece(game.curPlayer,game.target)
        if checkWin(game,game.target,len(game.board[game.target])-1):
            return
        game.curPlayer=game.returnPlr(2)

while sett.counter:
    if game.win:
        temp = leet(game.curPlayer + " wygrales", sett.margin, 0)
        screen.blit(temp.txt, [temp.pos[0], temp.pos[1]])
        sett.counter-=1
        pygame.display.flip()
        continue
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            sys.exit()
        if event.type == pygame.KEYDOWN:
            handle()
    if game.target<0:
        game.target+=sett.gridSize
    game.target=game.target%(sett.gridSize)

    screen.fill((255, 230, 240))
    temp = leet("Tera: "+game.curPlayer,sett.size*1.2,0)
    screen.blit(temp.txt, [temp.pos[0], temp.pos[1]])
    drawGrid(sett.gridSize+1)
    drawPieces()
    drawPointer()
    pygame.display.flip()
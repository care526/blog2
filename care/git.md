# Git

## Git相关的软件
- lazygit

## 文件
- .gitignore
  忽略配置文件
  ```sh
  # 忽略单个文件
  package.json
  # 忽略目录下的文件、或一组文件
  doc/a.js
  doc/*.txt
  # 忽略单个目录
  node_modules/
  # 将匹配到忽略的文件添加到版本控制
  *.zip # 忽略所以以zip结尾的文件
  !lib.zip # 将lib.zip添加到版本控制
  ```
  ```sh
  git rm filename # 删除文件 
  ```
  > 当某个文件已经添加到git了，中途又添加到忽略文件中，以下代码让忽略文件重新生效  
  ```sh
  git rm -r –-cached .  
  git add .  
  git commit -m "Refresh adding .gitignore file"  
  git rm -rf --cache 文件/文件夹
  ```

- .gitkeep
  git不会追踪空的目录，一般在空目录中新增一个名为.gitkeep的空文件做记录

## Git配置
### 全局
```sh
# 配置user.name   
git config --global user.name "care526Lj"
#配置user.email   
git config --global user.email "710783534@qq.com"
```
### 单个工程
去掉`--global`

### SSH Key
```sh
# 1、git user.name user.email 配置

# 2、检测是否有SSH Key
# ~/.ssh/id_rsa.pub 这个文件有没有
ssh-keygen -t rsa -C 710783534@qq.com
cat ~/.ssh/id_rsa.pub

# 3、添加到Github的中

# 4、测试是否成功
ssh -T git@github.com
```
ps: 只有SSH方式的链接才能用SSH提交

## github加速域名
- https://hub.fastgit.org

## 一个Git项目
### 初始化
git init
### 远程库操作
> 查看远程库地址
```sh
git remote -v
```
> 删除项目关联的远程库
```sh
git remote rm origin
```
> 在已有的git项目中添加远程仓库
```sh
# ssh
git remote add origin git@github.com:care526/learnGit.git　  
# https
git remote add origin https://github.com/care526/learnGit.git
```
origin 是远程库的默认 name，也可以改成别的名字  
#### 拉取远程仓库到本地
```sh
git clone git@github.com:care526/learnGit.git
git clone https://github.com/care526/learnGit.git
```
***
![image](./images/clipboard.png)   
### 工作区
> 查看修改
```sh
git status # 查看当前的修改了那些文件    
git diff filename # 查看具体修改了什么内容， filename是文件名  
```
> 撤销修改
如果文件先添加到暂存区了，那么会不会撤销暂存区的修改  
只会去除工作区的变更
```sh
git checkout a.js # 还原一个文件
git checkout . # 还原所有文件
```
> 添加文件到暂存区
```sh
git add xxx # 添加某文件到暂存区，可使用多次添加多个文件   
# 添加所有文件   
git add .　　
git add -A
```
### 暂存区
> 回退文件到工作区
```sh
git reset HEAD about.html # 回退一个文件
git reset HEAD # 回退暂存区所有
```
> 暂存文件的变更
```sh
git stash
git stash save "save message"
git stash list
git stash show
git stash show stash@{0}
git stash show -p
git stash show stash@{0} -p
git stash apply
git stash pop
git stash drop
git stash clear
```
ps: git stash不会暂存没有加到git版本控制中的文件
### 版本库
> 提交到版本库
```
# 提交(单行的提交记录)   
git commit -m "xxx"
# 提交(多行的提交记录)
git commit -m "
header: xxx
body: xxx
footer: xxx
"
```
> 查看版本
```sh
git log # 查看版本推送更迭历史记录   
git log --pretty=oneline # 同上，简化输出    
git log --graph --pretty=oneline --abbrev-commit # 同上，还可以看到分支的合并情况    
git log --stat --summary # 查看每一次版本的大致变动情况       
git show dfb02e6e4f2f7b573337763e5c0013802e392818 # 查看该版本的更新信息，也可以只写该版本的前几位dfb02e   
git show HEAD^ # 查看 HEAD 的父版本更新细节   
git show HEAD^^ # 查看 HEAD 的祖父版本更新细节      
git show HEAD~4 # 查看 HEAD 的上四个版本更新细节 
git reflog # 查看每一次的记录    
```
> 打Tag
```sh
git tag v0.1 dfb02 # 对dfb02版本生成一个自定义的版本号，对未来发布有好处   
```
> 回退版本
```sh
git reset --hard HEAD^ # 回退到上个版本   
git reset --soft 5029f0cc08cf # 回退到某个版本，并将变更放到暂存区 
git reset --mixed 5029f0cc08cf # 同--soft，但是不会把变更放到暂存区
git reset --hard HEAD^^ # 回退到上上个版本（^的个数以此类推）   
git reset --hard HEAD~10 # 回退到上10个版本（免得 ^ 写的太长）   
git reset --hard commit_id # 回退到指定版本，commit_id是某个版本号（版本号很长，可以只写前面几位）  
git revert -n commit_id 
```
- reset 会使会退版本之后的都清除  
- revert 只会将该版本的修改从分支中去掉，保留其他版本的变动，然后生成一个最新的版本，其他版本都在该版本之后 
> 分支操作
#### branch
> 分支查看、关联、删除
```sh
git branch # 查看本地分支
git branch -a # 查看本地和远程的分支(本地最近一次拉取的远程)
git branch -d xxx # 删除本地xxx分支(可能会出现警告)  
git branch -D xxx # 删除本地xxx分支(直接删除，不管有无警告)  
git branch --set-upstream xxx origin/xxx # 建立远程库分支与本地分支的关联   
```
#### fetch
> 抓取远程库的新提交到本地库
```sh
git fetch
```
#### checkout
> 创建分支
```sh
git checkout -b xxx # 基于当前分支拉一个新分支
git checkout -b xxx origin xxx # 拉取远程分支到本地并切换
git checkout xxx # 同上，简写
```
#### switch
> 切换分支
```sh
git switch xxx # 切换到指定的分支
```
#### merge
> 合并两个不同的分支
```sh
git merge xxx # 合并xxx分支到当前分支(有冲突的话需要解冲突再提交一次)
git merge --squash xxx # 只合并xxx和当前分支的差异项，并展示出来。不管有无冲突都需要重新提交一次(有冲突的话需要解冲突)
git merge --no-ff -m "XXX" xxx # 将xxx分支合并到当前分支(不采用Fast forward模式)，并创建commit描述，提交一次，XXX是这次提交的修改内容   
```
#### rebase
> 将当前分支变基到指定的分支，相当于新创建若干次提交记录(如果有的话)，commitId和之前是不同的
```sh
git rebase xxx
git rebase --continue # 如果上一步有冲突需要解冲突后执行该命令
```
### push
> 推送、删除远程分支
```sh
git push --set-upstream origin dev # 分支的第一次提交
git push -u origin master # 第一次提交要加-u,之后可以省略
git push # 提交当前分支到远程，如果没有提前拉取，会报错合并失败
git push origin master # 将当前分支推送到指定分支
git push --force # 强制用本地分支覆盖远端分支(后面还是可以接其他选项)
git push -f # 同上，简写
git push origin --delete xxx # 删除远端的指定分支
```

## 利用linux的管道，做一些复合操作
> 删除master以外的所有分支(执行前需在master分支，没有变更)
```sh
git branch | grep -v "master" | xargs git branch -D
```
ps: 
> 删除master以外的所有分支(无论是否有变更，是否在master分支)
```sh
git stash && git checkout master && git branch | grep -v "master" | xargs git branch -D
```











## 版本提交／查看／回退／撤销    

## 分支
创建分支的目的是在不影响主分支的情况下进行开发，在分支完成的时候将分支的内容和主分支合并即可   
 
git push --set-upstream origin dev　　在远程库创建分支并推送   

如果当前分支和主分支都提交的修改，但是修改的内容是不同的，我们在合并分支的时候就会发生冲突（相同文件的内容冲突），我们要手动修改两个分支为相同，然后才能合并分支，再删除   

修改某个分支的bug的时候，先在当前分支分一个分支，在分好的分支上进行修改，修改完了合并分支，再删除分出来的分支。
开发新功能的时候，也是先分一个功能分支，开发实验结束后再合并，删除，流程同bug分支    

当其他人对你要用的分支做了提交，远程库的分支领先于你的本地分支，要先拉取远程库的分支与本地合并，再做开发。如果拉取的分支和当前有冲突，要先解决冲突。 

合并分支的时候，发生冲突，解决完冲突后，已经合并，只需要commit一下就ok了

## 分支策略
- 开发/测试/线上 三个分支的方式
  每个人的所有开发都在master(线上)分支上拉取本地分支开发
  本地开发完成，将分支代码合入UAT(测试)分支供测试
  测试完成，检测是否可以自动合入master分支，如果不可以，用本地分支merge master分支，解决冲突，解冲突的过程中，询问冲突代码的之前开发人员，避免多次上线代码被冲掉，合入master
  分支开发完成，删除远程分支，本地分支保留一小段时间再删除，避免上线有问题，代码回滚，可立即重新上线
  UAT分支定期删除，从master分支拉取本地UAT分支，推送到远端
  ps: 本地开发的小技巧，前提是不需要和后端对接口的开发可以这样做
  如果后端使用cookie保存登录状态
  只要本地的域名配置为和代理（测试服/正式服）的域名一致，那么本地就可以访问代理的接口了
  hosts不要忘记配置了

## 子仓库
> 克隆带有子仓库的仓库
```bash
git clone --recursive http://xxx.git
```
> 添加子仓库
```bash
git submodule add http://xxx.git [./src/cdk]
# 将 http://xxx.git 仓库作为子仓库 添加到当前项目，目录为 ./src/cdk
```
> 子仓库代码推送
先推子仓库的代码，然后提交父仓库的改动
> 拉取完整的仓库
拉取父仓库，后
```bash
git submodule init
git submodule update
```

## git 流程规范
![image](./images/gitfenzhi.png)   

是以一个git分支的生命周期来规范
- 建立分支
  从master拉取分支
- 分支开发，不断提交
- 分支使用`git merge --squash xxx`合并dev，测试
  测试有问题如何处理：
  1. 当前合并后面没有新的提交
     本地dev回退一个版本，重新合并修改的开发分支  
  2. 当前合并后面有新的提交
     - 本地dev回退到自己合并前的一个版本，重新合并修改的开发分支
       并通知后面的功能开发者，重新合并提交
     - 或者先通知后面的功能开发者合并代码，自己后面再合并  ---
- 分支对应的功能点合并进master，分支删除

### 分支命名
- **分支类型**
  | 分支类型 | 解释 |
  |:-:|:-:|
  | feature | 功能开发 |
  | hotfix | 紧急热修复 |
  | docs | 文档变更 |
  | config | 配置文件修改 |
如果有多个类型的修改，以**feature**、**hotfix**为主  
- **命名规范**
  **type-name-func**    
  例：feature-lj-task-center   任务中心功能开发  
  type：开发分支类型    
  name：开发者名字首字母    
  func：具体的开发任务    

### 代码提交
`git commit -m "xxxx"`
规范提交内容  
- 本地开发提交
  这里提交内容最终会被废弃  
  作用：帮助开发自己明确每次提交的修改内容
  1. day: xxx       日常提交
  2. stage: xxx     阶段提交
  ```bash
  git commit -m "day: 修改商品版块"
  git commit -m "stage: 完成商品版块"
  ```
  ![image](./images/git-commit-day.png)   
- 合并dev分支提交
  ```bash
  git commit -m "
  version: 1.1.1

  feature: app任务中心版块优化

  修改范围只限于任务中心版块，提取所有任务的配置文件到public/json目录

  项目经理：xxx 产品：xxx 研发：xxx 测试：xxx
  "
  ```
  ![image](./images/git-merge-commit-feature.png)   

### 版本号
> 1.1.1  大号.中号.小号
- **开发任务下达**的时候，指定修改等级  
- **开发完成**
  1. 在dev分支 merge 开发分支的时候，修改版本号，对应等级版本加1  
  2. 在master合并hotfix分支的时候修改版本号，小号加1
     ps：即使是之前撤销的分支重新合并也加1，始终比上一个版本高即可  
- master合并代码的时候
- 删除对应开发分支的远程分支

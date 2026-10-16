# Java程序设计题库

> 共 219 题 | 1 个章节 | 单选题 192 + 多选题 12 + 判断题 15

---

## Java题库

### 1. 单选题

安装Java开发环境时，需要配置的环境变量是（　）

- A. PATH和CLASSPATH
- B. JAVA_HOME和PATH
- C. JAVA_HOME和CLASSPATH
- D. JRE_HOME和CLASSPATH

**答案**：B
**解析**：安装Java开发环境时，通常需要配置JAVA_HOME和PATH环境变量。JAVA_HOME指向JDK安装目录，PATH加入JDK的bin目录后，命令行才能直接运行java、javac等命令。CLASSPATH不是现代Java开发环境的必配项，JRE_HOME也不是编译环境的核心配置。

---

### 2. 单选题

当子类中的方法与父类中的方法具有相同的名称、参数列表和返回类型时，这种情况称为（　）

- A. 方法重载
- B. 方法重写
- C. 继承
- D. 多态

**答案**：B
**解析**：方法重写（Override）是指子类中定义与父类中同名、同参数列表、同返回类型的方法，覆盖父类方法。选项A方法重载要求参数列表不同；选项C继承是类间关系；选项D多态是重写实现的一种特性。

---

### 3. 单选题

已知 `String str = "Java";`，则 `str.charAt(1)` 的结果是（　）

- A. 'J'
- B. 'a'
- C. 'v'
- D. ""

**答案**：B
**解析**：字符串索引从0开始，str.charAt(1)返回索引1处的字符，即'a'。选项A是索引0的字符，选项C是索引2的字符，选项D是空字符串，均错误。

---

### 4. 单选题

在Java中，super关键字的作用不包括（　）

- A. 调用父类的构造方法
- B. 调用父类的成员方法
- C. 调用父类的成员变量
- D. 调用本类的构造方法

**答案**：D
**解析**：super关键字用于访问父类的构造方法、成员方法和成员变量，但不能调用本类的构造方法。调用本类构造方法应使用this关键字。因此D选项错误。

---

### 5. 单选题

当一个类没有显式地定义构造方法时，Java会自动提供一个（　）

- A. 带一个参数的构造方法
- B. 带两个参数的构造方法
- C. 无参构造方法
- D. 编译会报错

**答案**：C
**解析**：Java中，如果一个类没有显式定义任何构造方法，编译器会自动提供一个无参构造方法，该方法体为空，用于创建对象。选项A和B错误，因为自动提供的构造方法不带参数；选项D错误，因为不会报错。

---

### 6. 单选题

在Java中，以下哪种方式可以实现多态的动态绑定（　）

- A. 通过对象调用方法
- B. 通过类名调用静态方法
- C. 通过父类引用调用子类重写的方法
- D. 通过接口调用实现类的方法

**答案**：C
**解析**：多态的动态绑定是指在运行时根据对象的实际类型调用相应的方法。选项C中，通过父类引用调用子类重写的方法，正是动态绑定的典型应用。选项A描述的是普通方法调用，不一定是多态；选项B是静态方法调用，属于静态绑定；选项D虽然涉及接口，但未明确体现动态绑定，且C更直接符合题意。

---
### 7. 多选题

以下关于return语句的说法，正确的有（　）

- A. return语句用于从方法中返回一个值
- B. 一个方法中只能有一个return语句
- C. 如果方法的返回类型是void，则可以省略return语句
- D. return语句可以提前结束方法的执行

**答案**：A、C、D
**解析**：A正确，return用于从方法返回值（void方法可直接写return;）。B错误，一个方法可以有多个return语句，只要不产生不可达代码。C正确，void方法可以省略return。D正确，return会立即结束方法执行。

---
### 8. 多选题

关于Java中的垃圾回收机制，以下说法正确的有（　）

- A. 垃圾回收可以自动回收不再使用的对象所占用的内存
- B. 程序员可以手动调用垃圾回收方法来回收内存
- C. 垃圾回收会影响程序的性能
- D. 垃圾回收只回收堆内存中的对象

**答案**：A、B、C
**解析**：A正确，GC自动回收不可达对象。B正确，可调用System.gc()建议JVM回收（但不保证立即执行）。C正确，GC会产生Stop-The-World暂停，影响性能。D错误，方法区中的类元数据同样会被回收。

---

### 9. 单选题

Java语言中注释有三种类型，以下哪种注释方式会被Javadoc工具提取生成文档（　）

- A. //单行注释
- B. /*多行注释*/
- C. /**文档注释*/
- D. 以上都可以

**答案**：C
**解析**：Javadoc工具专门提取以/**开头、以*/结尾的文档注释，生成API文档。单行注释//和多行注释/* */不会被提取。因此正确答案是C。

---

### 10. 单选题

以下代码的输出结果是（　）
```java
int a=10; int b=5;
if(a>b){System.out.println("a大于b");}
else if(a<b){System.out.println("a小于b");}
else {System.out.println("a等于b");}
```

- A. a大于b
- B. a小于b
- C. a等于b
- D. 无输出

**答案**：A
**解析**：a=10，b=5，条件a>b成立，执行第一个分支输出"a大于b"，后续else if和else不执行。其他选项错误：B不满足条件，C不满足条件，D有输出。

---

### 11. 单选题

以下集合类中，适合频繁插入和删除操作的是（　）

- A. ArrayList
- B. LinkedList
- C. Vector
- D. HashSet

**答案**：B
**解析**：LinkedList基于双向链表实现，插入和删除操作只需修改节点指针，时间复杂度为O(1)，适合频繁插入和删除。ArrayList和Vector基于数组，插入删除需移动元素，效率低。HashSet基于哈希表，主要用于去重，不针对插入删除优化。

---

### 12. 单选题

while循环和do-while循环，以下说法正确的是（　）

- A. while循环和do-while循环的执行逻辑完全相同
- B. while循环先判断条件再执行循环体，do-while循环先执行循环体再判断条件
- C. while循环至少会执行一次循环体
- D. do-while循环有可能一次循环体都不执行

**答案**：B
**解析**：while循环先判断条件，条件为真才执行循环体，可能一次都不执行；do-while循环先执行一次循环体再判断条件，至少执行一次。选项B正确描述了这一区别。选项A错误，两者执行逻辑不同；选项C错误，while循环可能不执行；选项D错误，do-while至少执行一次。

---

### 13. 单选题

若要在Java程序中使用Scanner类来获取用户输入，导入语句正确的是（　）

- A. java.util.Scanner
- B. java.io.Scanner
- C. import java.util.Scanner;
- D. import java.io.Scanner;

**答案**：C
**解析**：在Java中，使用Scanner类需要导入java.util包，正确的导入语句是'import java.util.Scanner;'。选项A和B缺少import关键字，不是有效的导入语句。选项D导入了错误的包java.io.Scanner，该类不存在。因此，只有选项C正确。

---

### 14. 单选题

已知类A，以下创建类A对象的正确方式是（　）

- A. A a;
- B. A a = new;
- C. A a = new A();
- D. a = A();

**答案**：C
**解析**：选项C使用new关键字调用构造方法创建对象，语法正确。选项A只声明引用未创建对象；选项B缺少构造方法调用；选项D缺少new关键字且语法错误。

---

### 15. 单选题

关于Java中的包，以下说法正确的是（　）

- A. 包是用来组织类和接口的一种机制
- B. 不同包中的类不能同名
- C. 包名必须全部由大写字母组成
- D. 一个类只能属于一个包，不能跨包使用

**答案**：A
**解析**：选项A正确，包是Java中组织类和接口的机制，提供命名空间和访问控制。选项B错误，不同包中的类可以同名，通过包名区分。选项C错误，包名通常使用小写字母，如java.util。选项D错误，一个类只能属于一个包，但可以通过导入跨包使用。

---


### 16. 单选题

已知类Student有属性name和age，以下定义构造方法正确的是（　）

- A. 
```java
class Student{
    public Student(){
        Student("zhangsan",18);
    }
    private String name;
    private int age;
}
```

- B. 
```java
class Student{
    public Student(){
        this.name="zhangsan";
        this.age=18;
    }
    private String name;
    private int age;
}
```
- C. 
```java
class Student{
    public void Student(){
        this.name="zhangsan";
        this.age=18;
    }
    private String name;
    private int age;
}
```
- D. 以上都正确

**答案**：B
**解析**：选项B正确，构造方法名与类名相同且没有返回值类型，可以在方法体内用this为name和age赋值。A错误，构造方法中不能像普通方法一样直接调用Student("zhangsan",18)；C写了void，已经变成普通方法而不是构造方法；D因此不正确。

---
### 17. 多选题

若 Animal 类定义了非私有实例方法 move()，Dog 继承 Animal，以下调用 move 方法的方式正确的有（　）

- A. Animal animal = new Animal(); animal.move();
- B. Dog dog = new Dog(); dog.move();
- C. Animal animal = new Dog(); animal.move();
- D. Dog dog = (Dog)new Animal(); dog.move();

**答案**：A、B、C
**解析**：A通过Animal对象调用；B通过Dog对象调用继承来的方法；C通过父类引用指向子类对象调用该实例方法——三者都正确。D错误，new Animal()创建的是Animal对象，向下转型为Dog会抛ClassCastException。

---

### 18. 单选题

以下代码实现了面向对象的（　）特性
```java
class Shape{
    public void draw(){
        System.out.println("Drawing a shape");
    }
}
class Rectangle extends Shape{
    public void draw(){
        System.out.println("Drawing a rectangle");
    }
}
```

- A. 封装
- B. 继承
- C. 多态
- D. 以上都是

**答案**：C
**解析**：代码中Rectangle类继承Shape类并重写draw方法，体现了继承特性。但题目问的是“以下代码实现了面向对象的（ ）特性”，代码中通过父类引用指向子类对象并调用draw方法时，会执行子类的重写方法，这体现了多态性。封装是指隐藏内部实现，代码未体现。因此正确答案是多态。

---

### 19. 单选题

若要将一个字符串变量赋值为"Hello,World!"，正确的写法是（　）

- A. string s = "Hello, World!";
- B. String s = "Hello, World!";
- C. S = "Hello, World!";
- D. char s = "Hello, World!";

**答案**：B
**解析**：Java中字符串类型为String，首字母大写，且变量声明需指定类型。选项B正确。A中string首字母小写，不是Java关键字；C缺少类型声明；D中char只能存储单个字符，不能赋值字符串。

---

### 20. 单选题

若要将一个类的成员变量私有化，应该使用的访问修饰符是（　）

- A. public
- B. protected
- C. private
- D. default

**答案**：C
**解析**：私有化成员变量需使用private修饰符，使其仅在本类中可见。public公开访问，protected允许子类和同包访问，default允许同包访问，均不符合私有化要求。

---

### 21. 单选题

以下关于JDK、JRE和JVM的关系，正确的是（　）

- A. JVM包含JRE，JRE包含JDK
- B. JDK包含JRE，JRE包含JVM
- C. JRE包含JDK，JDK包含JVM
- D. JVM、JRE、JDK相互独立

**答案**：B
**解析**：JDK（Java开发工具包）包含JRE（Java运行环境），而JRE包含JVM（Java虚拟机）。选项B正确描述了这一包含关系。其他选项顺序颠倒或错误。

---

### 22. 单选题

以下运算符中，优先级最高的是（　）

- A. +
- B. ()
- C. &&
- D. =

**答案**：B
**解析**：在Java中，括号()的优先级最高，用于改变运算顺序。加号+优先级低于括号，逻辑与&&和赋值=优先级更低。因此正确答案是B。

---

### 23. 单选题

泛型通配符 `?` 的作用是（　）

- A. 表示任意类型
- B. 用于限制类型的下界
- C. 用于限制类型的上界
- D. 以上都不对

**答案**：A
**解析**：泛型通配符?表示未知类型，即任意类型，常用于泛型方法或泛型类的参数类型。选项B和C分别对应下界通配符? super T和上界通配符? extends T，不是?的直接作用。因此A正确。

---

### 24. 单选题

若要限制一个类不能被其他类继承，应该使用的关键字是（　）

- A. final
- B. abstract
- C. static
- D. private

**答案**：A
**解析**：final关键字用于修饰类时，表示该类不能被继承，符合题目要求。abstract类必须被继承才能使用，static不能修饰类，private不能修饰外部类。

---

### 25. 单选题

以下关于接口与抽象类的说法，错误的是（　）

- A. 接口中所有方法默认都是抽象的（JDK8之前）
- B. 一个类可以实现多个接口，但只能继承一个抽象类
- C. 接口不能有构造方法，抽象类可以有构造方法
- D. 接口中的成员变量默认是private，抽象类中的成员变量默认是public

**答案**：D
**解析**：选项D错误，因为接口中的成员变量默认是public static final，而非private；抽象类中的成员变量默认是default（包访问权限），而非public。其他选项正确：A接口方法默认抽象；B类可多实现接口但单继承抽象类；C接口无构造方法，抽象类有。

---

### 26. 单选题

以下关于方法重写的说法，正确的是（　）

- A. 方法重写要求方法名不同，参数列表必须相同
- B. 方法重写要求方法名相同，参数列表必须相同
- C. 方法重写要求返回类型必须不同
- D. 方法重写要求访问权限必须更严格

**答案**：B
**解析**：方法重写要求子类中方法名和参数列表与父类被重写方法完全相同，因此B正确。A错误，因为方法名必须相同；C错误，返回类型可以相同或是子类型；D错误，访问权限不能更严格，应相同或更宽松。

---

### 27. 单选题

以下不属于面向对象三大特性的是（　）

- A. 封装
- B. 继承
- C. 多态
- D. 接口

**答案**：D
**解析**：面向对象三大特性是封装、继承和多态。接口是实现多态的一种方式，但不是特性本身。因此，不属于三大特性的是接口。

---

### 28. 单选题

以下关于break语句和continue语句的说法，错误的是（　）

- A. break语句用于跳出当前循环
- B. continue语句用于跳过本次循环剩余的代码，继续下一次循环
- C. break语句和continue语句只能用在循环语句中
- D. 在多层循环嵌套中，break语句默认只能跳出最内层循环

**答案**：C
**解析**：选项C错误，因为break语句除了用于循环，还可以用于switch语句中跳出switch块。A、B、D描述正确。

---

### 29. 单选题

以下属于Java基本数据类型的是（　）

- A. String
- B. Integer
- C. double
- D. ArrayList

**答案**：C
**解析**：Java基本数据类型包括byte、short、int、long、float、double、char、boolean。double是基本数据类型之一。String、Integer、ArrayList都是引用类型，其中Integer是包装类。

---

### 30. 单选题

已知 `int num=123`；若要获取num的个位数，正确的表达式是（　）

- A. num / 10
- B. num % 10
- C. num / 100
- D. num % 100

**答案**：B
**解析**：要获取个位数，应使用取模运算 num % 10，结果为 3。选项 A 得到十位数 12，选项 C 得到百位数 1，选项 D 得到后两位 23，均不正确。

---

### 31. 单选题

当一个方法的返回类型为void时，表示该方法（　）

- A. 没有返回值
- B. 返回一个空对象
- C. 返回值为null
- D. 返回值为0

**答案**：A
**解析**：void表示方法不返回任何值，因此选项A正确。选项B、C、D都表示有返回值，与void定义矛盾。

---

### 32. 单选题

若要将一个整型变量num的值强制转换为float类型，正确的写法是（　）

- A. float f = num;
- B. float f = (float)num;
- C. float f = float(num);
- D. f = (float)num;

**答案**：B
**解析**：在Java中，强制类型转换使用括号将目标类型括起来放在变量前，即(float)num。选项A是自动类型转换，但int到float是隐式转换，虽然正确但不符合“强制转换”要求；选项C语法错误；选项D缺少变量类型声明。因此B正确。

---

### 33. 单选题

以下关于Java程序编译的说法，正确的是（　）

- A. 编译后的文件可以直接在任何操作系统上运行
- B. 编译是将Java源文件(.java)转换为字节码文件(.class)
- C. 编译过程中不会检查语法错误
- D. 一个Java源文件只能生成一个字节码文件

**答案**：B
**解析**：选项B正确，Java编译过程将.java源文件转换为.class字节码文件。A错误，字节码需依赖JVM运行，不同操作系统需对应JVM。C错误，编译时会检查语法错误。D错误，一个源文件可生成多个字节码文件（如内部类）。

---

### 34. 单选题

首次提出Java语言的时间是（　）

- A. 1991年
- B. 1995年
- C. 2000年
- D. 2005年

**答案**：A
**解析**：Java语言由Sun Microsystems公司于1991年启动开发，最初名为Oak，1995年正式发布。因此首次提出时间是1991年，选项A正确。B是正式发布年份，C和D均晚于实际时间。

---

### 35. 单选题

以下关于抽象类的说法，正确的是（　）

- A. 抽象类可以被实例化
- B. 抽象类中只能有抽象方法
- C. 子类必须重写抽象父类中的所有抽象方法
- D. 抽象类不能包含非抽象方法

**答案**：C
**解析**：抽象类不能实例化，A错误；抽象类可以包含非抽象方法，B和D错误；子类如果是非抽象类，必须重写父类所有抽象方法，C正确。

---

### 36. 单选题

若有类A和类B，B实现了接口C，以下说法正确的是（　）

- A. A可以继承B，同时实现C
- B. A可以继承B，但不能再实现C
- C. A不能继承B，但可以实现C
- D. A既不能继承B，也不能实现C

**答案**：A
**解析**：在Java中，类可以同时继承一个类和实现多个接口。因此，A可以继承B，同时实现C。选项B错误，因为继承类后仍可实现接口；选项C错误，因为A可以继承B；选项D错误，因为A可以继承B并实现C。

---

### 37. 单选题

一个类实现接口时，必须（　）

- A. 实现接口中的所有方法
- B. 实现接口中的部分方法
- C. 可以不实现接口中的方法
- D. 实现接口中的抽象方法

**答案**：D
**解析**：一个类实现接口时，必须实现接口中定义的所有抽象方法（除非该类是抽象类）。Java 8+中接口还可以包含default默认方法和static静态方法，这些方法不需要实现类重写。 选项A错误，'所有方法'说法不对，default和static方法无需实现。 选项B错误，抽象方法必须全部实现，不能只实现部分。 选项C错误，非抽象类必须实现全部抽象方法。 选项D正确，实现类只需实现接口中的抽象方法。

---

### 38. 单选题

当子类继承父类时，子类可以（　）

- A. 增加新的属性和方法
- B. 只能继承父类的属性和方法，不能进行修改和扩展
- C. 不能继承父类的私有属性和方法
- D. A和C都正确

**答案**：D
**解析**：子类继承父类时，可以增加新的属性和方法（A正确），但不能直接访问父类的私有成员（C正确），因此D选项“A和C都正确”为正确答案。B选项错误，因为子类可以扩展和修改（通过重写）父类方法。

---

### 39. 单选题

关于一维数组的遍历，以下代码正确的是（　）

- A. 
```java
int[] arr={1,2,3};
for(int i=0;i<arr.length;i++){
    System.out.println(arr[i]);
}
```
- B. 
```java
int[] arr={1,2,3};
for(int num : arr){
    System.out.println(num);
}
```
- C. A和B都正确
- D. 以上都不对

**答案**：C
**解析**：选项A使用传统for循环，通过索引遍历数组，正确。选项B使用增强for循环，直接遍历数组元素，也正确。因此A和B都正确，故选C。

---

### 40. 单选题

已知 `int a=5; int b=2;` 则 `a / b` 的结果是（　）

- A. 2.5
- B. 2
- C. 3
- D. 2.0

**答案**：B
**解析**：在Java中，两个整数相除结果为整数，小数部分直接舍弃。a=5，b=2，5/2=2，因此结果为2。选项A和D为浮点数，错误；选项C为3，错误。

---

### 41. 单选题

关于final关键字，以下说法错误的是（　）

- A. 用final修饰的类不能被继承
- B. 用final修饰的方法不能被重写
- C. 用final修饰的变量不能被重新赋值
- D. final变量必须在声明时初始化

**答案**：D
**解析**：final变量可以在声明时初始化，也可以在构造器中初始化（对于实例变量）或静态初始化块中初始化（对于静态变量），因此D选项说法错误。A、B、C选项均正确描述了final的用法。

---

### 42. 单选题

关于if-else语句，以下说法正确的是（　）

- A. else部分是必须的
- B. if后面的条件表达式只能是布尔类型
- C. if语句中不能嵌套if语句
- D. 当if条件为假时，程序直接结束

**答案**：B
**解析**：在Java中，if-else语句的else部分是可选的，不是必须的，故A错误。if后面的条件表达式必须是布尔类型，这是Java语法的规定，故B正确。if语句中可以嵌套if语句，形成多重判断，故C错误。当if条件为假时，如果有else部分则执行else块，否则跳过if语句继续执行后续代码，并非直接结束程序，故D错误。

---

### 43. 单选题

Java程序的执行过程中，负责将字节码文件转换为机器码的是（　）

- A. JDK
- B. JRE
- C. JVM
- D. IDE

**答案**：C
**解析**：JVM（Java虚拟机）负责将字节码文件解释或编译为机器码并执行。JDK是开发工具包，JRE是运行环境，IDE是集成开发环境，它们都不直接执行字节码转换。

---

### 44. 单选题

对于类的成员变量，若不指定访问修饰符，其默认的访问权限是（　）

- A. public
- B. protected
- C. private
- D. default（包访问权限）

**答案**：D
**解析**：在Java中，类的成员变量若不指定访问修饰符，默认具有包访问权限（即default），只能被同一包中的类访问。选项A、B、C分别对应public、protected、private，都不是默认权限。

---

### 45. 单选题

以下代码中，main方法输出结果是（　）
```java
class Parent{
    public void method(){
        System.out.println("Parent method");
    }
}
class Child extends Parent{
    public void method(){
        System.out.println("Child method");
    }
}
public class Test{
    public static void main(String[] args){
        Parent parent = new Child();
        parent.method();
    }
}
```

- A. Parent method
- B. Child method
- C. 编译错误
- D. 运行时错误

**答案**：B
**解析**：由于Java动态绑定，父类引用指向子类对象时，调用的是子类重写的方法，因此输出"Child method"。编译和运行均无错误。

---

### 46. 单选题

泛型方法的正确声明是（　）

- A. `public static <T> T add(T a,T b){ return a; }`
- B. `public static add(int a,T b){ return a; }`
- C. `public static <T> add(T a,T b){ return a; }`
- D. `public static <T> add(T a,b){ return a; }`

**答案**：A
**解析**：泛型方法需要先声明类型参数`<T>`，随后写返回类型，再写方法名和参数列表。选项A中的返回类型为T，参数a和b也声明为T，语法完整。B缺少类型参数和返回类型；C缺少返回类型；D中参数b缺少类型声明。

---

### 47. 单选题

关于Java中的继承，下列说法错误的是（　）

- A. 子类可以继承父类所有属性和方法
- B. 一个子类只能有一个直接父类
- C. 继承可以提高代码的复用性
- D. 子类可以重写父类的方法

**答案**：A
**解析**：选项A错误，因为子类不能继承父类的私有属性和方法，也不能继承构造方法。其他选项正确：B符合单继承规则，C是继承的优点，D是方法重写的定义。

---

### 48. 单选题

以下哪种情况体现了Java中的多态（　）

- A. 父类引用指向子类对象，调用子类重写后的方法
- B. 子类重写父类的多个同名方法
- C. 在同一个类中，多个同名但参数不同的方法
- D. 定义多个变量，变量名相同但变量类型不同

**答案**：A
**解析**：多态指同一操作作用于不同对象产生不同执行结果，通常通过父类引用指向子类对象并调用重写方法实现。A正确；B描述重写但未体现父类引用；C是重载；D是变量声明，均不体现多态。

---

### 49. 单选题

下面关于Java类的构造方法，说法正确的是（　）

- A. 构造方法不能有参数
- B. 构造方法名必须与类名相同
- C. 构造方法必须有返回值
- D. 一个类只能有一个构造方法

**答案**：B
**解析**：构造方法名必须与类名相同，且没有返回值类型（void也不行）。A错误，构造方法可以有参数；C错误，构造方法没有返回值；D错误，一个类可以有多个重载的构造方法。

---

### 50. 单选题

以下代码中，存在编译错误的是（　）
```java
class Animal {
    public void eat() {
        System.out.println("Animal is eating");
    }
}
class Dog extends Animal {
    public void bark() {
        System.out.println("Dog is barking");
    }
}
public static void main(String[] args) {
    Animal animal = new Dog();
    animal.bark();
}
```

- A. 无错误
- B. animal.bark();这行代码
- C. animal.eat();这行代码
- D. 整个代码都有错误

**答案**：B
**解析**：编译错误发生在 animal.bark() 这行。因为 animal 是 Animal 类型的引用，虽然实际指向 Dog 对象，但编译器只根据引用类型检查可调用的方法，Animal 类中没有 bark() 方法，所以编译失败。其他选项错误：A 有错误；C 的 eat() 方法在 Animal 中定义，可以调用；D 只有一行错误。

---

### 51. 单选题

下列关于方法重载的描述，错误的是（　）

- A. 方法重载要求方法名相同
- B. 方法重载要求参数列表不同
- C. 方法重载要求返回类型不同
- D. 方法重载的方法必须处在同一个类中

**答案**：C
**解析**：方法重载要求方法名相同且参数列表不同，与返回类型无关。选项C错误，因为返回类型不同不能作为重载的依据，仅靠返回类型不同无法构成重载。其他选项正确描述了重载的规则。

---

### 52. 单选题

接口中定义的方法默认的访问修饰符是（　）

- A. public
- B. protected
- C. private
- D. default

**答案**：A
**解析**：在Java中，接口中的方法默认是public abstract的，因此访问修饰符默认为public。protected和private在接口中不允许用于方法（Java 9之前），default是包访问权限，但接口方法默认是public。

---

### 53. 单选题

关于Java中的异常处理，以下说法正确的是（　）

- A. 异常处理与面向对象无关
- B. 捕获异常后，程序一定会继续执行
- C. 异常分为运行时异常和编译异常
- D. 所有异常都必须使用try-catch处理

**答案**：C
**解析**：Java异常分为运行时异常（RuntimeException及其子类）和编译时异常（Checked Exception），因此C正确。A错误，异常处理基于面向对象，异常是类；B错误，捕获异常后可能退出程序；D错误，运行时异常可不处理。

---

### 54. 单选题

在Java中，以下哪种方式不能实现多态的动态绑定（　）

- A. 通过对象调用普通方法
- B. 通过类名调用静态方法
- C. 通过父类引用调用子类重写的方法
- D. 通过接口调用实现类的方法

**答案**：B
**解析**：多态的动态绑定发生在运行时，根据实际对象类型调用重写的方法。静态方法属于类，通过类名调用在编译时确定，不涉及动态绑定。A、C、D选项均涉及对象方法调用，可实现动态绑定。

---

### 55. 单选题

关于this关键字的说法正确的是（　）

- A. this只能在构造方法中使用
- B. this可以用来调用本类的其他构造方法
- C. this可以用来调用父类的方法
- D. this不能用于成员方法中

**答案**：B
**解析**：this关键字可以在构造方法和成员方法中使用，用于引用当前对象。选项B正确，因为this()可以调用本类的其他构造方法。选项A错误，this不仅限于构造方法；选项C错误，调用父类方法应使用super；选项D错误，this常用于成员方法中。

---

### 56. 单选题

若要在一个类中定义一个常量，应该使用的关键字是（　）

- A. final
- B. static
- C. public
- D. private

**答案**：A
**解析**：在Java中，定义常量通常使用final关键字，表示该变量一旦赋值后不可修改。static用于类成员，public和private是访问修饰符，不能单独定义常量。因此正确答案是A。

---

### 57. 单选题

以下代码实现了（　）设计模式的思想
```java
interface Shape { void draw(); }
class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}
class Rectangle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle");
    }
}
```

- A. 工厂模式
- B. 策略模式
- C. 单例模式
- D. 观察者模式

**答案**：B
**解析**：代码定义了Shape接口及其实现类Circle和Rectangle，每个类有自己的draw方法实现，体现了策略模式中定义算法族并使其可互换的思想。工厂模式涉及创建对象，单例模式确保唯一实例，观察者模式定义一对多依赖，均不匹配。

---

### 58. 单选题

以下关于Java中的泛型，说法错误的是（　）

- A. 泛型可以提高代码的类型安全性
- B. 泛型可以在编译时进行类型检查
- C. 泛型可以避免强制类型转换
- D. 泛型方法不能在类中单独定义

**答案**：D
**解析**：泛型方法可以在普通类或泛型类中单独定义，因此D选项错误。A、B、C选项均正确：泛型通过编译时类型检查提高安全性，并避免强制类型转换。

---

### 59. 单选题

关于Java中的接口，以下说法正确的是（　）

- A. 接口中可以定义成员变量
- B. JDK7中接口里的方法可以有方法体
- C. 一个类只能实现一个接口
- D. 接口不能被实例化

**答案**：D
**解析**：接口中只能定义常量（public static final），不能定义普通成员变量，故A错。JDK7中接口方法只能是抽象方法，不能有方法体，JDK8才允许default和static方法，故B错。一个类可以实现多个接口，故C错。接口不能实例化，D正确。

---

### 60. 单选题

以下代码中，Test类的main方法输出结果是（　）
```java
class A{
    int num = 10;
    public void show(){
        System.out.println("A:"+num);
    }
}
class B extends A{
    int num = 20;
    public void show(){
        System.out.println("B:"+num);
    }
}
public class Test {
    public static void main(String[] args) {
        A a = new B();
        a.show();
    }
}
```

- A. A:10
- B. A:20
- C. B:10
- D. B:20

**答案**：D
**解析**：由于多态性，父类引用指向子类对象，调用show()方法时执行子类的重写方法，输出B:20。成员变量num在子类中隐藏了父类的num，但方法中使用的num是子类的num，因此输出20。

---

### 61. 单选题

当一个类实现了Serializable接口时，意味着该类的对象可以（　）

- A. 被序列化保存到文件
- B. 被自动垃圾回收
- C. 被自动克隆
- D. 被自动转化为字符串

**答案**：A
**解析**：实现Serializable接口的对象可以被序列化，即转换为字节流保存到文件或通过网络传输。选项B错误，垃圾回收与Serializable无关；选项C错误，克隆需实现Cloneable接口；选项D错误，转化为字符串需重写toString方法。

---

### 62. 单选题

已知int num=10;正确的语句是（　）

- A. int num = 10;
- B. integer num = 10;
- C. num = 10.0;
- D. num = null;

**答案**：A
**解析**：选项A正确，因为变量num已声明为int类型，重新赋值10是合法的。选项B错误，因为Java中整数类型是int而非integer。选项C错误，因为10.0是double类型，不能直接赋值给int变量。选项D错误，因为int是基本类型，不能赋值为null。

---

### 63. 单选题

以下循环可以输出1到10的代码是（　）

- A. for(int i=1;i<=10;i++){System.out.println(i);}
- B. for(int i=1;i<10;i++){System.out.println(i);}
- C. for(int i=0;i<=10;i++){System.out.println(i);}
- D. for(int i=0;i<10;i++){System.out.println(i);}

**答案**：A
**解析**：选项A的循环从i=1开始，条件i<=10，每次递增1，输出1到10，正确。选项B输出1到9，缺少10；选项C输出0到10，多出0；选项D输出0到9，多出0且缺少10。

---

### 64. 单选题

创建一个长度为5的整型数组，正确的语句是（　）

- A. int arr[5];
- B. int arr[] = new int[5];
- C. int arr = new int[5];
- D. int arr[5] = new int[];

**答案**：B
**解析**：选项B正确，因为Java中创建数组需使用new关键字，且语法为int[] arr = new int[5]或int arr[] = new int[5]。A选项C语言语法，Java中不允许；C选项类型不匹配，arr应为数组类型；D选项声明时不能指定大小，且new int[]缺少长度。

---

### 65. 单选题

获取字符串"java is fun"的长度，应使用的方法是（　）

- A. str.length()
- B. str.size()
- C. str.len()
- D. str.length

**答案**：A
**解析**：在Java中，获取字符串长度应使用length()方法，即str.length()。选项A正确。选项B的size()用于集合类；选项C的len()是Python中的用法；选项D的length是数组的属性，不是字符串的方法。

---
### 66. 多选题

关于switch语句的说法正确的有（　）

- A. switch后面的表达式可以是字符
- B. case后面的值必须是常量
- C. case分支必须都写break语句
- D. default分支可以放在任意位置

**答案**：A、B、D
**解析**：A正确，switch支持char类型（JDK 7起还支持String）。B正确，case值必须是编译时常量。C错误，break用于跳出switch，不写会「贯穿」执行下一个case，并非必须。D正确，default可以出现在任意位置。

---

### 67. 单选题

下面代码中，变量flag的值为（　）
```java
boolean flag = 5 > 3 && 2 < 1;
```

- A. true
- B. false
- C. null
- D. 编译报错

**答案**：B
**解析**：表达式5>3为true，2<1为false，true && false结果为false，因此flag值为false。选项A错误，选项C null不能赋值给基本类型boolean，选项D编译不会报错。

---

### 68. 单选题

下面关于equals()方法说法正确的是（　）

- A. ==比较地址，equals()比较内容
- B. 所有类的equals()都自动重写
- C. String类重写了equals方法用来比较字符内容
- D. 基本类型可以调用equals()

**答案**：C
**解析**：String类重写了equals()方法，用于比较字符串的字符内容是否相等，因此C正确。A错误，因为Object类的equals()默认比较地址，但许多类重写后比较内容；B错误，并非所有类都自动重写equals()；D错误，基本类型不能调用方法。

---

### 69. 单选题

子类重写父类的方法，通过父类引用调用子类重写的方法，这属于（　）

- A. 封装
- B. 继承
- C. 多态
- D. 方法重载

**答案**：C
**解析**：通过父类引用调用子类重写的方法，是运行时多态的典型表现，即动态绑定。封装是隐藏实现细节，继承是子类获得父类成员，方法重载是同一类中方法名相同参数不同，均不符合题意。

---

### 70. 单选题

int a=1, b=3; 则 a++ + b++ 的结果为（　）

- A. 4
- B. 5
- C. 6
- D. 7

**答案**：A
**解析**：a++是后置自增，先使用a的原值1参与运算，然后a自增为2；b++同理，先使用b的原值3参与运算，然后b自增为4。因此表达式结果为1+3=4，对应选项A。

---

### 71. 单选题

在Java中，下列哪个关键字用于定义常量（　）

- A. static
- B. final
- C. const
- D. abstract

**解析**：final修饰的变量一旦赋值就不能再修改，用于定义常量；const是Java的保留字但未使用。

---

### 72. 单选题

若要将num的值强制转换为float类型，正确的写法是（　）

- A. float(num);
- B. (float)num;
- C. num float;
- D. float num;

**答案**：B
**解析**：在Java中，强制类型转换的语法是使用圆括号将目标类型括起来，放在要转换的变量或表达式之前，即 (float)num。选项A的写法是C语言风格，Java不支持；选项C和D的语法错误。因此正确答案是B。

---

### 73. 单选题

关于Collections工具类的binarySearch()方法，说法正确的是（　）

- A. 可以在无序集合中查找元素
- B. 要求集合元素必须实现Comparable接口或提供比较器
- C. 返回值是元素在集合中的索引，如果不存在则返回 -1
- D. 以上都正确

**答案**：B
**解析**：binarySearch()方法要求集合必须有序，且元素需实现Comparable接口或提供比较器。A错误，因为无序集合无法使用二分查找；C错误，因为未找到时返回的是插入点负值而非-1。B正确描述了前提条件。

---

### 74. 单选题

以下关于Java中多态的说法，正确的是（　）

- A. 父类引用指向子类对象，调用的是父类中定义的方法
- B. 父类引用指向子类对象，调用的是子类重写后的方法
- C. 子类引用可以指向父类对象
- D. 多态只适用于抽象类，不适用于普通类

**答案**：B
**解析**：多态中，父类引用指向子类对象时，调用的是子类重写后的方法，这是动态绑定的结果。A错误，因为实际调用的是子类重写的方法；C错误，子类引用不能直接指向父类对象，需强制类型转换；D错误，多态适用于普通类（通过继承和重写）和抽象类。

---

### 75. 单选题

关于Java中的静态成员，以下说法正确的是（　）

- A. 静态变量在对象创建时分配内存
- B. 静态变量在类加载时分配内存
- C. 静态方法中可以使用this关键字
- D. 静态成员不能被子类继承

**答案**：B
**解析**：静态变量在类加载时分配内存，属于类而非对象，因此B正确。A错误，静态变量在类加载时分配，而非对象创建时；C错误，静态方法中不能使用this关键字，因为this代表当前对象；D错误，静态成员可以被子类继承。

---

### 76. 单选题

以下代码中，说法正确的是（　）
```java
class A {}
class B extends A {}
A a = new B();
```

- A. 编译错误，A类型变量不能指向B对象
- B. 运行时错误
- C. 合法，B的对象可以赋值给A类型的变量
- D. 合法，但调用方法时只能调用A类的方法

**答案**：C
**解析**：在Java中，子类对象可以赋值给父类类型的变量，这是向上转型，合法且自动完成。选项C正确。选项A错误，因为父类变量可以指向子类对象；选项B错误，代码编译和运行均无错误；选项D错误，虽然变量类型为A，但实际对象是B，调用方法时若B重写了A的方法，则调用B的方法，但若调用B独有的方法则需强制类型转换。

---

### 77. 单选题

关于this关键字，以下说法正确的是（　）

- A. this可以用来调用父类的构造方法
- B. this可以用来调用当前对象的方法
- C. this可以在静态方法中使用
- D. this代表的是父类对象

**答案**：B
**解析**：this关键字代表当前对象的引用，可以用来调用当前对象的方法或构造方法。选项A错误，调用父类构造方法应使用super；选项C错误，静态方法中不能使用this；选项D错误，this代表当前对象而非父类对象。

---

### 78. 单选题

关于子类继承父类的说法，正确的是（　）

- A. 子类可以继承父类的私有属性
- B. 子类不能继承父类的私有属性，但可以通过getter/setter方法访问
- C. 子类可以直接访问父类的私有属性
- D. 私有属性不能被子类以任何方式访问

**答案**：B
**解析**：子类不能继承父类的私有属性，但可以通过父类提供的公共getter/setter方法间接访问。A错误，私有属性不可继承；C错误，子类不能直接访问；D错误，可通过公共方法访问。

---

### 79. 单选题

关于Java中的if语句，以下说法正确的是（　）

- A. if后面的条件可以是任意类型
- B. if后面的条件必须是布尔类型的表达式
- C. if语句中不能使用比较运算符
- D. if语句必须与else一起使用

**答案**：B
**解析**：Java中if语句的条件必须是布尔类型表达式，不能是任意类型。比较运算符如==、<等可以用于生成布尔表达式，因此C错误。if语句可以单独使用，不必须与else配对，故D错误。

---

### 80. 单选题

以下关于字符串连接的说法，正确的是（　）

- A. 字符串可以使用+号进行连接
- B. 字符串只能使用concat()方法连接
- C. 字符串连接后会改变原字符串的内容
- D. 字符串连接只能连接字符串类型，不能连接其他类型

**答案**：A
**解析**：选项A正确，Java中字符串可以使用+号进行连接，这是最常用的方式。选项B错误，字符串还可以使用+号连接。选项C错误，字符串连接后原字符串不变，会生成新字符串。选项D错误，字符串连接可以连接其他类型，如int，会自动转换为字符串。

---

### 81. 单选题

Java源文件的扩展名是（　）

- A. .class
- B. .java
- C. .jav
- D. .jvm

**答案**：B
**解析**：Java源文件的扩展名必须是.java，这是Java编译器识别源文件的标准。.class是编译后的字节码文件扩展名，.jav和.jvm不是Java官方使用的扩展名。

---

### 82. 单选题

关于Java中main方法的定义，正确的是（　）

- A. `public static void main(String args)`
- B. `public static void main(String[] args)`
- C. `public void main(String[] args)`
- D. `static void main(String[] args)`

**答案**：B
**解析**：Java中main方法的正确签名是public static void main(String[] args)，其中public和static缺一不可，参数必须是String数组或可变参数String... args。选项A参数类型错误，选项C缺少static，选项D缺少public，只有B完全正确。

---

### 83. 单选题

以下关于Java平台版本的说法，正确的是（　）

- A. Java SE是标准版，Java EE是企业版，Java ME是微型版
- B. Java SE是企业版，Java EE是标准版
- C. Java SE和Java EE功能完全相同
- D. Java ME是Java的标准版本

**答案**：A
**解析**：Java SE（标准版）是核心基础，Java EE（企业版）基于SE并添加企业级功能，Java ME（微型版）用于嵌入式设备。选项A正确描述了各版本定位。B将SE和EE混淆；C错误，两者功能不同；D错误，Java ME不是标准版。

---

### 84. 单选题

关于Java中包的作用，以下说法正确的是（　）

- A. 包的主要作用是组织和管理类和接口
- B. 包的主要作用是提高程序运行速度
- C. 包的主要作用是减少内存占用
- D. 包的主要作用是实现多线程

**答案**：A
**解析**：包用于将相关的类和接口组织在一起，便于管理和维护，同时提供命名空间以避免命名冲突。选项B、C、D分别涉及运行速度、内存占用和多线程，这些并非包的主要功能。

---

### 85. 单选题

关于Java中的数组，以下说法正确的是（　）

- A. 数组创建后可以动态增加长度
- B. 数组的长度在创建后不能改变
- C. 数组可以存储不同类型的数据
- D. 数组没有length属性

**答案**：B
**解析**：数组在Java中创建后长度固定，不能动态增加，因此B正确。A错误，数组长度不可变；C错误，数组只能存储相同类型的数据；D错误，数组有length属性。

---

### 86. 单选题

关于Java中的Vector类，以下说法正确的是（　）

- A. Vector是线程安全的
- B. Vector不是线程安全的
- C. Vector不能存储对象
- D. Vector是Map接口的实现类

**答案**：A
**解析**：Vector是线程安全的，其方法使用synchronized修饰，适合多线程环境。B错误，Vector是线程安全的；C错误，Vector可以存储对象；D错误，Vector是List接口的实现类，不是Map。

---

### 87. 单选题

关于Java中的泛型，以下说法正确的是（　）

- A. 泛型信息在运行时会被保留
- B. 泛型信息在运行时会被擦除
- C. 泛型只能用于集合类
- D. 泛型类型参数可以直接使用基本数据类型

**答案**：B
**解析**：Java泛型通过类型擦除实现，运行时泛型类型参数会被擦除，因此B正确。A错误，运行时不会保留完整泛型类型参数。C错误，泛型可用于类、接口、方法等，不限于集合类。D错误，泛型类型参数不能直接使用int、double等基本数据类型，需要使用Integer、Double等包装类。

---

### 88. 单选题

以下哪个类或接口可以用来获取当前日期（　）

- A. String
- B. Math
- C. Date
- D. System

**答案**：C
**解析**：Date类用于表示日期和时间，可以通过new Date()获取当前日期。String是字符串类，Math是数学工具类，System提供系统相关方法，均不能直接获取当前日期。

---

### 89. 单选题

对List集合进行排序，可以使用以下哪个方法（　）

- A. Collections.sort()
- B. Arrays.sort()
- C. List.sort()（Java 8及以上）
- D. A和C都正确

**答案**：D
**解析**：Collections.sort() 和 List.sort() 都可以对 List 集合进行排序，前者是 Collections 工具类的静态方法，后者是 List 接口的默认方法（Java 8 引入）。Arrays.sort() 用于数组排序。因此 D 正确。

---

### 90. 单选题

关于LinkedList类，以下说法正确的是（　）

- A. LinkedList实现了List接口
- B. LinkedList实现了Map接口
- C. LinkedList是线程安全的
- D. LinkedList不能存储null值

**答案**：A
**解析**：LinkedList实现了List接口，也实现了Deque接口，因此A正确。B错误，LinkedList未实现Map接口。C错误，LinkedList不是线程安全的，多线程环境下需使用Collections.synchronizedList等方法。D错误，LinkedList允许存储null值。

---

### 91. 单选题

使用Calendar类获取当前年份，正确的方法是（　）

- A. `calendar.get(Calendar.YEAR)`
- B. `calendar.getYear()`
- C. `calendar.year()`
- D. `Calendar.getYear()`

**答案**：A
**解析**：Calendar类中获取年份的正确方法是get(Calendar.YEAR)，返回int类型。B选项getYear()是Date类的方法，已过时；C选项year()不存在；D选项静态调用错误，getYear()非静态方法。

---

### 92. 单选题

对数组进行排序，可以使用以下哪个方法（　）

- A. Arrays.sort()
- B. Collections.sort()
- C. Array.sort()
- D. List.sort()

**答案**：A
**解析**：Arrays.sort() 是 java.util.Arrays 类提供的静态方法，专门用于对数组进行排序，支持基本类型和对象数组。Collections.sort() 用于对 List 集合排序，不能直接用于数组。Array.sort() 和 List.sort() 方法不存在。

---

### 93. 单选题

关于TreeSet类，以下说法正确的是（　）

- A. TreeSet中的元素是无序的
- B. TreeSet中的元素是有序且不重复的
- C. TreeSet允许存储重复元素
- D. TreeSet是List接口的实现类

**答案**：B
**解析**：TreeSet基于TreeMap实现，元素按自然顺序或比较器排序，且不允许重复，因此B正确。A错误，TreeSet有序；C错误，不允许重复；D错误，TreeSet实现Set接口。

---
### 94. 多选题

以下哪些方式可以正确初始化一个数组（　）

- A. int[] arr = {1, 2, 3};
- B. int[] arr = new int[]{1, 2, 3};
- C. int arr[] = {1, 2, 3};
- D. int[] arr = new int[3]{1, 2, 3};

**答案**：A、B、C
**解析**：A和C是静态初始化（C是C风格的数组声明写法，Java同样支持）；B是匿名数组初始化。三者都合法。D错误，`new int[3]{1,2,3}`同时指定长度和初始值，是语法错误。

---

### 95. 单选题

使用Calendar类获取24小时制的小时数，应该使用以下哪个常量（　）

- A. Calendar.HOUR
- B. Calendar.HOUR_OF_DAY
- C. Calendar.MINUTE
- D. Calendar.AM_PM

**答案**：B
**解析**：Calendar.HOUR_OF_DAY 返回24小时制的小时数（0-23），而 Calendar.HOUR 返回12小时制的小时数（0-11），Calendar.MINUTE 返回分钟，Calendar.AM_PM 返回上午或下午标识。因此正确答案是 B。

---

### 96. 单选题

关于Java 8中的DateTimeFormatter类，以下说法正确的是（　）

- A. DateTimeFormatter是线程安全的
- B. DateTimeFormatter不是线程安全的
- C. DateTimeFormatter不能格式化日期
- D. DateTimeFormatter只能解析日期，不能格式化日期

**答案**：A
**解析**：DateTimeFormatter是线程安全的，因为它是不可变的，设计用于并发环境。B错误；C和D错误，因为DateTimeFormatter既能格式化也能解析日期。

---

### 97. 单选题

以下代码中，存在编译错误的是（　）
```java
public class Main {
    public static void main(String[] args) {
        int num;
        System.out.println(num);
    }
}
```

- A. 无错误
- B. int num;这行代码
- C. System.out.println(num);这行代码
- D. 整个代码都有错误

**答案**：C
**解析**：局部变量num在使用前未初始化，Java中局部变量必须显式初始化才能使用，否则编译报错。因此System.out.println(num);这行存在编译错误。选项A错误，因为存在错误；选项B错误，声明变量本身不报错；选项D错误，只有一行有错误。

---

### 98. 单选题

已知boolean flag = true; 则 !flag 的值为（　）

- A. true
- B. false
- C. 1
- D. 0

**答案**：B
**解析**：!flag 是对布尔变量 flag 取反，flag 为 true，取反后为 false。选项 B 正确。选项 A 是原值，选项 C 和 D 是整数，不是布尔值。

---

### 99. 单选题

以下关于Java中类和对象的说法，正确的是（　）

- A. 一个类只能创建一个对象
- B. 对象是类的实例，类是对象的模板
- C. 类和对象没有任何关系
- D. 类必须有构造方法，否则无法创建对象

**答案**：B
**解析**：选项B正确，因为类是对象的抽象模板，对象是类的具体实例。A错误，一个类可以创建多个对象；C错误，类和对象紧密相关；D错误，类没有显式构造方法时，编译器会提供默认无参构造方法，仍可创建对象。

---

### 100. 单选题

已知 int[] arr = {1,2,3,4,5}; 则 arr[2] 的值为（　）

- A. 1
- B. 2
- C. 3
- D. 4

**答案**：C
**解析**：数组索引从0开始，arr[2]对应第三个元素，值为3。

---

### 101. 单选题

Java语言是由哪家公司开发的（　）

- A. Microsoft
- B. Apple
- C. Oracle（原Sun Microsystems）
- D. Google

**答案**：C
**解析**：Java语言最初由Sun Microsystems公司开发，后被Oracle公司收购。因此正确答案是C选项。A选项Microsoft开发了C#等语言；B选项Apple开发了Swift等；D选项Google开发了Kotlin等，均与Java无关。

---
### 102. 多选题

以下选项中关于Java集合的说法正确的有（　）

- A. List接口中存放的元素有序，可重复
- B. List接口中存放的元素具有有序，不唯一的特点
- C. Set接口中存放的元素具有无序，不唯一的特点
- D. Map接口存放的是映射信息，每个元素都是一个键值对

**答案**：A、B、D
**解析**：A和B都正确，List有序且元素可重复（「不唯一」即可重复）。C错误，Set的元素是不可重复的。D正确，Map以键值对形式存储映射信息。

---

### 103. 单选题

阅读下面的程序片段：
```java
String str = "abcde";
String[] arr = str.split("c");
System.out.println(arr.length);
```
程序执行后，打印的结果为（　）

- A. 2
- B. 3
- C. 4
- D. 5

**答案**：A
**解析**：split("c") 方法以 "c" 为分隔符将字符串 "abcde" 分割成两部分："ab" 和 "de"，因此数组长度为 2。其他选项错误。

---
### 104. 多选题

下面对this的作用描述正确的有（　）

- A. 当成员变量和局部变量重名的时候，可以区分
- B. this语句必须放在构造函数的第一行，根据this括号中的参数调用本类的其他构造函数
- C. this可以调用本类的一般函数
- D. this可以调用父类的一般函数

**答案**：A、B、C
**解析**：A正确，this.name区分成员变量与同名局部变量。B正确，this(...)调用本类其他构造方法时必须位于第一行。C正确，可用this.method()调用本类方法。D错误，调用父类方法要用super。

---

### 105. 单选题

下面关于 java.util.Random 类方法的说法，错误的是（ ）。

- A. nextDouble() 返回 [0.0, 1.0) 范围内的 double 值
- B. nextFloat() 可以指定上界并返回 [0, n) 范围内的 float 值
- C. nextInt(n) 返回 [0, n) 范围内的 int 值
- D. nextLong() 返回 long 类型的随机值

**答案**：B
**解析**：正确答案：B。java.util.Random 的 nextFloat() 不接收上界参数，返回的是 [0.0, 1.0) 范围内的 float 值。nextDouble() 返回 [0.0, 1.0) 的 double 值，nextInt(n) 返回 [0, n) 的 int 值，nextLong() 返回 long 类型随机值。

---

### 106. 单选题

下列选项中，正确使用了泛型的是（　）

- A. `ArrayList<String> list = new ArrayList<String>();`
- B. `ArrayList list = new ArrayList();`
- C. `ArrayList list = new ArrayList<String>();`
- D. `ArrayList<String> list = new ArrayList();`

**答案**：A
**解析**：选项A正确，因为泛型声明和实例化类型一致。选项B未使用泛型，选项C和D中声明与实例化类型不匹配，导致编译警告或错误。

---

### 107. 单选题

下面的代码运行结果是（　）
```java
class TestA {
    public void start() { System.out.println("TestA"); }
}
public class TestB extends TestA {
    public void start() { System.out.println("TestB"); }
    public static void main(String[] args) {
        ((TestA)new TestB()).start();
    }
}
```

- A. TestA
- B. TestB
- C. 编译失败
- D. 运行时抛出异常

**答案**：B
**解析**：代码中，TestB 继承 TestA 并重写 start 方法。main 方法中，将 TestB 对象向上转型为 TestA，但调用 start 方法时，由于 Java 的动态绑定机制，实际执行的是子类 TestB 的 start 方法，因此输出 "TestB"。选项 A 错误，因为不会调用父类方法；选项 C 和 D 错误，因为编译和运行均正常。

---

### 108. 单选题

阅读下面代码：
```java
public static void main(String[] args) {
    List<String> list = new ArrayList<>();
    list.add("aa");
    list.add("bb");
    Iterator<String> it = list.iterator();
    while (it.hasNext()) {
        String str = it.next();
        if (str.equals("aa")) {
            list.remove(str);
        }
    }
    System.out.println(list);
}
```
下列选项中，哪一个是程序执行后的结果（　）

- A. [bb]
- B. [aa,bb]
- C. []
- D. 以上都不对

**答案**：A
**解析**：程序在迭代过程中使用list.remove()修改列表，会触发ConcurrentModificationException异常，因此不会输出任何列表内容，选项A、B、C均错误，故选D。

---

### 109. 单选题

下列OutputStream流方法哪个是刷新此输出流并强制写出所有缓冲的输出字节（　）

- A. write()
- B. close()
- C. flush()
- D. void()

**答案**：C
**解析**：flush()方法用于刷新此输出流并强制写出所有缓冲的输出字节。write()用于写入字节，close()关闭流但不一定强制刷新，void()不是OutputStream的方法。

---

### 110. 单选题

下列List接口的方法，不是从Collection接口中继承而来的是（　）

- A. size()
- B. add()
- C. get()
- D. remove()

**答案**：C
**解析**：List接口继承自Collection接口，Collection接口定义了size()、add()和remove()方法，而get()方法是List接口特有的，用于按索引访问元素，不是从Collection继承的。因此正确答案是C。

---

### 111. 单选题

下面对于构造方法的描述，错误的是（　）

- A. 方法名必须和类名相同
- B. 构造方法不能有返回值
- C. 构造方法可以重载
- D. 构造方法的访问权限必须和类的访问权限一致

**答案**：D
**解析**：构造方法的访问权限可以与类的访问权限不同，例如类可以是public，而构造方法可以是private（单例模式）。A、B、C选项均正确。

---

### 112. 单选题

下列选项中，对Math.random()方法描述正确的是（　）

- A. 返回一个不确定的整数
- B. 返回0或是1
- C. 返回一个随机double类型，该数大于等于0.0小于1.0
- D. 返回一个随机int型数，该数大于等于0小于10

**答案**：C
**解析**：Math.random()方法返回一个伪随机double值，范围是[0.0, 1.0)，即大于等于0.0且小于1.0。选项A错误，因为返回的是double而非整数；选项B错误，返回的是0.0到1.0之间的数，不限于0或1；选项D错误，返回的是double而非int，且范围不固定。

---

### 113. 单选题

下列关于Thread类的说法中，错误的是（　）

- A. Thread类实现了Runnable接口，可以防止出现多父类问题
- B. Thread类属于java.lang包
- C. 继承Thread的方式定义线程后，写的run方法会在线程的start方法被调用后被JVM自动运行
- D. 继承Thread的方式定义线程后，你不能再继承其他的类了，导致程序的可扩展性大大降低

**答案**：A
**解析**：选项A错误，Thread类实现了Runnable接口，但实现接口是为了提供线程执行的目标，并非为了防止多父类问题。防止多父类问题是Java单继承机制的特点，与实现接口无关。其他选项正确：B属于java.lang包；C中start()调用后JVM自动运行run()；D指出单继承限制扩展性。

---

### 114. 单选题

表达式"hello" instanceof String 返回的值是（　）

- A. true
- B. false
- C. 1
- D. 0

**答案**：A
**解析**：instanceof 运算符用于判断对象是否为指定类型，"hello" 是 String 类型，因此返回 true。选项 B 错误，因为 "hello" 确实是 String 实例；选项 C 和 D 错误，因为 instanceof 返回布尔值，不是整数。

---

### 115. 单选题

已知String对象s="abcdefg"，则s.substring(2,5)的返回值为（　）

- A. bcde
- B. cde
- C. cdef
- D. def

**答案**：B
**解析**：substring(2,5)方法返回从索引2开始到索引5结束的子串，不包括索引5。索引2对应字符'c'，索引5对应字符'f'，因此子串为"cde"。选项A错误，因为包含了索引1的'b'；选项C错误，因为包含了索引5的'f'；选项D错误，因为从索引3开始。

---

### 116. 单选题

下列选项中，可以正确实现String初始化的是（　）

- A. String str = abc;
- B. String str = "abc";
- C. String str = 'abc';
- D. String str = 123;

**答案**：B
**解析**：Java中字符串字面量必须使用双引号，因此String str = "abc";可以正确初始化String对象。A中的abc会被当作变量名；C使用单引号且包含多个字符，不是合法字符串；D把整数直接赋给String变量，类型不匹配。

---

### 117. 单选题

下面的集合能直接获取java.util.Iterator迭代器的是（　）

- A. java.util.HashSet
- B. java.util.ArrayList
- C. java.util.TreeSet
- D. 以上都对

**答案**：D
**解析**：HashSet、ArrayList和TreeSet都实现了java.util.Collection接口，而Collection接口继承了Iterable接口，因此它们都能通过iterator()方法直接获取Iterator迭代器。所以选项D“以上都对”正确。

---

### 118. 单选题

ActionEvent的对象会被传递给（　）事件处理程序。

- A. addChangeListener
- B. addActionListener
- C. stateChanged
- D. actionPerformed

**答案**：D
**解析**：ActionEvent是Java AWT/Swing中的动作事件，当用户点击按钮等操作时触发。该事件需通过addActionListener方法注册监听器，并传递给actionPerformed方法处理。选项D正确，A用于ChangeEvent，B是注册监听器的方法，C是ChangeListener的方法。

---

### 119. 单选题

以下集合中，不属于Collection接口的子接口的是（　）

- A. List
- B. Set
- C. Queue
- D. Properties

**答案**：D
**解析**：Properties类继承自Hashtable，属于Map接口的实现，而非Collection接口的子接口。List、Set、Queue都是Collection接口的子接口。

---

### 120. 单选题

线程生命周期中正确的状态是（　）

- A. 新建状态、运行状态和终止状态
- B. 新建状态、运行状态、阻塞状态和终止状态
- C. 新建状态、可运行状态、运行状态、阻塞状态和终止状态
- D. 新建状态、可运行状态、运行状态、恢复状态和终止状态

**答案**：C
**解析**：Java线程生命周期包括新建、可运行、运行、阻塞和终止五个状态。选项C正确描述了这五个状态。A缺少可运行和阻塞状态；B缺少可运行状态；D中的“恢复状态”不是标准状态。

---

### 121. 单选题

System.in的作用是（　）

- A. 控制台输入数据的读取
- B. 控制台输出的数据读取
- C. 控制输出的顺序读写
- D. 对文件的随机访问

**答案**：A
**解析**：System.in是Java标准输入流，默认连接键盘，用于从控制台读取输入数据。选项A正确描述了其作用。选项B错误，因为控制台输出应使用System.out。选项C和D分别涉及输出顺序和文件随机访问，与System.in无关。

---

### 122. 单选题

在Java中，如果父类中的某些方法不包含任何逻辑，并且需要由子类重写，应该使用（　）关键字来声明父类的这些方法。

- A. final
- B. static
- C. abstract
- D. void

**答案**：C
**解析**：abstract关键字用于声明抽象方法，抽象方法没有方法体，必须由子类重写。final方法不能被重写，static方法属于类，void是返回类型，均不符合题意。

---

### 123. 单选题

在程序读入二进制文件时，能够以该文件作为直接参数的类是（　）

- A. FileReader
- B. BufferedReader
- C. FileInputStream
- D. ObjectInputStream

**答案**：C
**解析**：二进制文件应使用字节流读取。FileInputStream 是字节输入流，可直接以文件作为参数构造。FileReader 是字符流，用于文本文件；BufferedReader 需要包装其他 Reader；ObjectInputStream 需要包装其他 InputStream，不能直接以文件为参数。

---

### 124. 单选题

假定一个方法会产生非RuntimeException异常，如果希望把异常交给调用该方法的方法处理，正确的声明方式是（　）

- A. throw Exception
- B. throws Exception
- C. new Exception
- D. 不需要指明什么

**答案**：B
**解析**：throws用于声明方法可能抛出的异常，将异常交给调用者处理。throw用于抛出异常对象，new Exception创建异常对象，都不符合题意。

---
### 125. 多选题

下列关于多态的叙述正确的有（　）

- A. 父类的引用指向子类的实例是一种多态
- B. 子类的引用指向父类的实例是一种多态
- C. 接口的引用指向实现该接口类的实例是一种多态
- D. 抽象类的引用指向子类的实例是一种多态

**答案**：A、C、D
**解析**：A正确，父类引用指向子类对象是典型多态。C正确，接口引用指向实现类实例同理。D正确，抽象类引用指向子类实例同理。B错误，子类引用不能直接指向父类实例，需强制转型且运行期可能失败，不构成多态。

---

### 126. 单选题

下列属于受检异常的是（　）

- A. RuntimeException
- B. ClassCastException
- C. IOException
- D. ArrayIndexOutOfBoundsException

**答案**：C
**解析**：受检异常（checked exception）是必须被捕获或声明的异常，IOException属于受检异常。RuntimeException及其子类（如ClassCastException、ArrayIndexOutOfBoundsException）属于非受检异常，不需要强制处理。

---

### 127. 单选题

下面方法中，可以实现获取字符在某个字符串中第一次出现的索引的是（　）

- A. charAt(int index)
- B. int indexOf(int ch)
- C. boolean endsWith(String suffix)
- D. int lastIndexOf(int ch)

**答案**：B
**解析**：indexOf(int ch)方法返回指定字符在字符串中第一次出现的索引，符合题意。charAt(int index)返回指定索引处的字符，而非查找索引。endsWith(String suffix)判断字符串是否以指定后缀结尾。lastIndexOf(int ch)返回指定字符最后一次出现的索引。

---

### 128. 单选题

请将下列四步进行排列，完成文件的复制操作。
① 将字节流写入到目标文件；② 关闭流；③ 构建输入流和输出流；④ 循环读写。

- A. ①②③④
- B. ②①③④
- C. ③④①②
- D. ②③①④

**答案**：C
**解析**：文件复制操作的正确顺序是：先构建输入流和输出流（③），然后循环读写（④），接着将字节流写入目标文件（①），最后关闭流（②）。对应选项C（③④①②）。其他选项顺序错误：A（①②③④）先写入再构建流，B（②①③④）先关闭再构建，D（②③①④）先关闭再构建。

---

### 129. 单选题

String类中的getBytes()方法的作用是（　）

- A. 将整数变成字节数组
- B. 将字符串变成字符数组
- C. 将字符串变成字节数组
- D. 获取字符串中字符的个数

**答案**：C
**解析**：getBytes()方法将字符串按平台默认字符集编码为字节序列，返回字节数组。选项C正确。A错误，getBytes()不处理整数；B错误，将字符串变字符数组用toCharArray()；D错误，获取字符个数用length()。

---

### 130. 单选题

StringBuffer类append()方法的返回值类型是（　）

- A. String
- B. void
- C. StringBuffer
- D. StringBuilder

**答案**：C
**解析**：StringBuffer类的append()方法返回的是StringBuffer对象本身，以便实现链式调用。因此返回值类型是StringBuffer。选项A错误，String是不可变类；选项B错误，append()返回对象而非void；选项D错误，StringBuilder是另一个类。

---

### 131. 单选题

File类的public boolean isFile()的作用是（　）

- A. 判断该对象对应的是否是文件
- B. 判断该对象对应的是否是目录
- C. 在当前目录下生成指定的目录
- D. 在当前目录下生成指定的文件

**答案**：A
**解析**：isFile()方法用于判断File对象是否对应一个存在的文件，返回true表示是文件，false表示不是文件或不存在。选项A正确。选项B是isDirectory()的功能；选项C和D涉及创建目录或文件，对应mkdir()或createNewFile()方法。

---

### 132. 单选题

新建一个流对象，下面选项代码错误的是（　）

- A. new BufferedReader(new FileReader("a.txt"));
- B. new BufferedWriter(new FileOutputStream("a.txt"));
- C. new ObjectInputStream(new FileInputStream("a.txt"));
- D. new ObjectOutputStream(new FileOutputStream("a.txt"));

**答案**：B
**解析**：选项B错误，因为BufferedWriter需要Writer类型的参数，而FileOutputStream是OutputStream类型，不匹配。正确用法是new BufferedWriter(new OutputStreamWriter(new FileOutputStream("a.txt")))。其他选项参数类型正确。

---

### 133. 单选题

```java
public class SimpleDateFormatTest{
    public static void main(String[] args) throws ParseException {
        String date = "1998-01-01";
        SimpleDateFormat sdf = new SimpleDateFormat(______);
        Date date = sdf.parse(date);
        System.out.println(date);
    }
}
```
横线处应该填写（　）

- A. yyyy-MM-dd
- B. yyyy/MM/dd
- C. yyyy.MM.dd
- D. yyyy-MM-dd HH:mm

**答案**：A
**解析**：选项A的格式"yyyy-MM-dd"与字符串"1998-01-01"完全匹配，因此能正确解析。选项B和C的分隔符不匹配，选项D包含时间部分但字符串中没有，会导致解析异常。

---

### 134. 单选题

如要读取文件中的中间一段内容，最方便的采用下列（　）流来操作。

- A. FileInputStream
- B. PipedInputStream
- C. RandomAccessFile
- D. FileReader

**答案**：C
**解析**：RandomAccessFile支持随机访问文件，可以定位到任意位置读取数据，最适合读取文件中间一段内容。FileInputStream和FileReader只能顺序读取，PipedInputStream用于线程间管道通信。

---

### 135. 单选题

当方法遇到异常又不知如何处理时，下列做法正确的是（　）

- A. 捕获异常
- B. 抛出异常
- C. 声明异常
- D. 嵌套异常

**答案**：C
**解析**：当方法遇到异常又不知如何处理时，应使用throws声明异常，将异常抛出给调用者处理。捕获异常（A）需要处理逻辑，抛出异常（B）是主动抛出，嵌套异常（D）不是标准做法。声明异常（C）是正确做法。

---

### 136. 单选题

对于catch子句的排列，正确的是（　）

- A. 父类在先，子类在后
- B. 子类在先，父类在后
- C. 有继承关系的异常不能在同一个try程序段内
- D. 先有子类，其他如何排列都无关

**答案**：B
**解析**：在Java中，catch子句应按照子类在先、父类在后的顺序排列，因为异常匹配按顺序进行，若父类在前会捕获所有子类异常，导致子类catch块不可达。选项A错误，选项C错误（可以有继承关系的异常），选项D不准确。

---

### 137. 单选题

FileReader的父类是（　）

- A. BufferedReader
- B. InputStreamReader
- C. Reader
- D. Writer

**答案**：B
**解析**：FileReader继承自InputStreamReader，而InputStreamReader继承自Reader。因此FileReader的直接父类是InputStreamReader，选项B正确。A BufferedReader是Reader的子类但不是FileReader的父类，C Reader是抽象基类（祖父类），D Writer是输出流类与FileReader无关。

---

### 138. 单选题

无论是否发生异常，都需要执行的是（　）

- A. try语句块
- B. catch语句块
- C. finally语句块
- D. return语句

**答案**：C
**解析**：finally语句块无论是否发生异常都会执行，用于释放资源等清理操作。try语句块是可能抛出异常的代码块；catch语句块仅在捕获到特定异常时执行；return语句用于返回值，不一定执行。

---

### 139. 单选题

下列关于进程和线程的说法中，错误的是（　）

- A. 操作系统中每个独立执行的程序都可称之为一个进程
- B. 操作系统中的每一个进程中都至少存在一个线程
- C. 线程和进程一样，是由CPU轮流执行的
- D. 线程和进程一样，是由CPU同时执行的

**答案**：D
**解析**：选项D错误，因为CPU在同一时刻只能执行一个线程或进程，通过快速切换实现并发，而非同时执行。选项A、B、C正确：进程是程序的一次执行，每个进程至少有一个线程，CPU轮流执行线程和进程。

---

### 140. 单选题

使新创建的线程参与运行调度方法是（　）

- A. run()
- B. start()
- C. init()
- D. resume()

**答案**：B
**解析**：start()方法会启动一个新线程，并使其进入就绪状态，等待CPU调度执行run()方法。run()只是普通方法调用，不会创建新线程。init()是初始化方法，resume()用于恢复挂起的线程，均不参与运行调度。

---

### 141. 单选题

假若String类的indexOf()方法未能找到所指定的子字符串，则返回以下选项中（　）

- A. false
- B. 0
- C. -1
- D. 以上答案都不对

**答案**：C
**解析**：String类的indexOf()方法在未找到指定子字符串时返回-1，这是Java API的明确规定。选项A的false是布尔值，而indexOf()返回int；选项B的0表示子串在起始位置找到，并非未找到。因此正确答案是C。

---

### 142. 单选题

下列关于包（package）的说法，正确的是（　）

- A. package语句必须位于源文件的第一行（注释除外）
- B. 一个源文件中可以有多个package语句
- C. import语句必须写在package语句之前
- D. 包名不能包含点号

**答案**：A

---

### 143. 单选题

下面说法中错误的是（　）

- A. 静态代码块只在类加载后执行一次，以后再创建对象的时候不执行
- B. 局部代码块的作用是为了限制变量的生命周期
- C. 构造代码块在每创建一次对象就执行一次
- D. 以上都不对

**答案**：D
**解析**：选项A、B、C的说法都是正确的。静态代码块在类加载时执行一次；局部代码块限制变量作用域；构造代码块每次创建对象时执行。因此D选项“以上都不对”是错误的。

---

### 144. 单选题

File类的public boolean delete()方法的作用是（　）

- A. 从文件系统内删除该文件
- B. 程序顺利结束时从系统中删除文件
- C. 判断文件是否存在
- D. 当文件不存在时创建文件

**答案**：A
**解析**：File类的delete()方法用于直接删除文件或目录，成功返回true，失败返回false。选项A正确描述了该方法的功能。选项B错误，因为delete()是立即执行，不依赖程序结束。选项C是exists()方法的功能。选项D是createNewFile()方法的功能。

---

### 145. 单选题

当编译并且运行下面程序时会出现（　）结果。
```java
public class ThrowsDemo{
    static void throwMethod() {
        System.out.print("Inside throwMethod");
        throw new IOException("demo");
    }
    public static void main(String [] args){
        try{
            throwMethod();
        }catch(IOException e){
            System.out.println("Caught"+e);
        }
    }
}
```

- A. 编译错误
- B. 运行错误
- C. 编译成功，但不会打印出任何结果
- D. 没有输出结果

**答案**：A
**解析**：程序编译错误，因为throwMethod方法声明抛出IOException，但未在方法签名中使用throws子句声明该异常，导致编译失败。

---

### 146. 单选题

在oneMethod()方法运行正常的情况下将显示（　）。
```java
public void test() {
    try {
        oneMethod();
        System.out.println("condition 1");
    } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("condition 2");
    } catch(Exception e) {
        System.out.println("condition 3");
    } finally {
        System.out.println("finally");
    }
}
```

- A. condition 1
- B. condition 2
- C. condition 3
- D. condition 1 finally

**答案**：D
**解析**：由于oneMethod()运行正常，不会抛出异常，因此try块中的代码会正常执行，输出"condition 1"。无论是否发生异常，finally块都会执行，输出"finally"。所以最终输出为"condition 1"和"finally"，对应选项D。

---

### 147. 单选题

Thread类定义于下列（　）包中。

- A. java.io
- B. java.lang
- C. java.util
- D. java.awt

**答案**：B
**解析**：Thread类位于java.lang包中，该包是Java核心包，自动导入，包含基本类如Object、String等。其他选项：java.io处理输入输出，java.util提供工具类，java.awt用于图形界面，均不包含Thread类。

---

### 148. 单选题

File类的public File[] listFiles()方法的作用是（　）

- A. 返回文件和目录清单（File对象）
- B. 返回文件和目录清单（字符串对象）
- C. 在当前目录下生成指定的目录
- D. 判断该File对象所对应的是否是文件

**答案**：A
**解析**：listFiles()方法返回一个File数组，包含当前目录下的文件和子目录的File对象，因此A正确。B错误，因为返回的是File对象而非字符串；C是mkdir()或mkdirs()的功能；D是isFile()方法的功能。

---

### 149. 单选题

在程序下画线处填入正确选项是（　）
```java
public class Test implements Runnable{
    public static void main(String args[]){
        ________________________;
        t.start();
    }
    public void run(){
        System.out.println("Hello");
    }
}
```

- A. Thread t=new Test();
- B. Thread t=new Thread();
- C. Thread t=new Thread(new Test());
- D. Test t=new Test();

**答案**：C
**解析**：要实现多线程，需创建Thread对象并传入Runnable实例。Test实现了Runnable，因此正确选项是C：创建Thread对象时传入new Test()作为Runnable参数。A错误，因为Test不是Thread的子类；B错误，因为没有传入Runnable，不会执行run方法；D错误，因为Test没有start方法。

---

### 150. 单选题

下列对于Runtime的描述中，正确的是（　）

- A. 每一个Java应用程序运行时都产生一个Runtime类实例
- B. Runtime实例可以将应用程序和运行环境相结合
- C. Runtime类没有构造函数
- D. Runtime实例需要被创建后才可以通过getRuntime()方法获取

**答案**：C
**解析**：Runtime类采用单例模式，没有公有构造函数，通过静态方法getRuntime()获取唯一实例。选项A错误，因为每个Java应用只有一个Runtime实例；选项B错误，Runtime实例用于与运行环境交互，但描述不准确；选项D错误，getRuntime()方法返回单例，无需先创建实例。

---

### 151. 单选题

求平方根方法public static double sqrt(double a)可以传递的参数类型不包括（　）

- A. byte
- B. float
- C. String
- D. long

**答案**：C
**解析**：Math.sqrt方法接受double类型参数。byte、float、long可自动转换为double，而String不能直接转换为double，因此不能传递String类型参数。

---

### 152. 单选题

下列代码中，（　）可以插入到第7行，将抛出java.lang.ClassCastException异常。
```java
interface F{}
class A implements F{}
class B extends A{}
class C extends B{}
public static void main(String[] args){
    B b=new C();
    // insert code here
}
```

- A. A a=b;
- B. C c=(C)new A();
- C. F f=(A)b;
- D. B b2=(B)(F)b;

**答案**：B
**解析**：选项B中，new A()创建的是A类对象，不是C类对象，强制向下转型为C时会在运行时抛出ClassCastException。选项A是安全的向上转型；选项C先把b视为A再赋给接口F引用，实际对象仍是C，转换安全；选项D中b实际指向C对象，C也是B的子类并实现F相关继承关系，转换后赋给B引用不会抛出异常。因此正确答案是B。

---

### 153. 多选题

Random对象能够生成以下（　）类型的随机数。

- A. int
- B. string
- C. char
- D. double

**答案**：A、D
**解析**：Random类可以生成int、double、float、long、boolean等类型的随机数，但不能直接生成String或char类型。因此正确答案为int和double。

---

### 154. 单选题

请阅读下面程序，上面程序的运行结果为（　）
```java
package exercise;
public class Test {
    System.out.println("构造方法一被调用了");
    public Test(){
        this(true);
        System.out.println("构造方法二被调用了");
    }
    public Test(boolean b){
        System.out.println("构造方法三被调用了");
    }
    public static void main(String args[]){
        Test test=new Test(true);
    }
}
```

- A. 构造方法一、构造方法二和构造方法三都被调用了
- B. 只有构造方法一和构造方法二被调用了
- C. 只有构造方法一和构造方法三被调用了
- D. 只有构造方法三被调用了

**答案**：D
**解析**：程序在main方法中通过new Test(true)调用带boolean参数的构造方法，因此只执行构造方法三，输出"构造方法三被调用了"。构造方法一不是构造方法，而是实例初始化块，但它在构造方法之前执行，然而由于没有调用无参构造器，初始化块不会执行。构造方法二通过this(true)调用构造方法三，但未被调用。因此只有构造方法三被调用。

---

### 155. 单选题

下列选项中，不属于HashMap类的方法的是（　）

- A. get(Object key)
- B. keySet()
- C. contains()
- D. entrySet()

**答案**：C
**解析**：HashMap类没有contains()方法，其相关方法为containsKey(Object key)和containsValue(Object value)。A、B、D选项均为HashMap类的方法。

---

### 156. 单选题

FileReader类中有很多重载的读取字符的方法，其中read()方法如果读取已到达流的末尾，将返回的值是（　）

- A. 0
- B. -1
- C. 无返回值
- D. null

**答案**：B
**解析**：FileReader的read()方法在读取到流末尾时返回-1，这是Java IO中表示流结束的约定。选项A的0表示读取到空字符，选项C和D错误，因为read()方法有返回值。

---

### 157. 单选题

阅读下面代码，Test.java的编译运行结果是（　）
```java
interface Face{
    int counter=40;
}
public class Test implements Face{
    private static int counter;
    public static void main(String args[]){
        System.out.println(++counter);
    }
}
```

- A. 40
- B. 41
- C. 0
- D. 1

**答案**：D
**解析**：接口中的 counter 是 public static final 常量，而 Test 类中定义的 counter 是私有静态变量，两者不同。main 方法中 ++counter 操作的是 Test 类的 counter，初始值为 0，自增后输出 1。

---

### 158. 单选题

try语句块可以（　）

- A. 拥有惟一的一个catch语句块
- B. 对应多个finally语句块
- C. 对应一个或多个catch语句块
- D. 以上答案都不对

**答案**：C
**解析**：try语句块可以对应一个或多个catch语句块，用于捕获不同类型的异常。A错误，因为可以有多个catch；B错误，finally只能有一个；D错误，C正确。

---

### 159. 单选题

使用（　）组件允许用户通过键盘输入数据。

- A. JButton
- B. JTextField
- C. JLabel
- D. 以上选项均不对

**答案**：B
**解析**：JTextField是Swing中的文本框组件，允许用户通过键盘输入单行文本。JButton是按钮，JLabel是标签，均不支持键盘输入。因此正确答案是B。

---

### 160. 单选题

下列是除0异常的是（　）

- A. RuntimeException
- B. ClassCastException
- C. ArithmeticException
- D. ArrayIndexOutOfBoundsException

**答案**：C
**解析**：除0异常属于算术异常，Java中由ArithmeticException表示。A是运行时异常父类，B是类型转换异常，D是数组越界异常，均不特指除0。

---

### 161. 单选题

当鼠标键被按下并进行移动时会调用（　）事件处理程序。

- A. mouseDragged
- B. mouseMoved
- C. mouseChanged
- D. mouseClicked

**答案**：A
**解析**：鼠标键被按下并进行移动时触发鼠标拖动事件，对应方法为mouseDragged。mouseMoved在鼠标移动但未按下键时触发；mouseClicked是单击事件；mouseChanged不是标准事件方法。

---

### 162. 单选题

假设有自定义异常ServiceException，那么抛出该异常的语句正确的是（　）

- A. raise ServiceException
- B. throw new ServiceException()
- C. throws ServiceException
- D. throw ServiceException

**答案**：B
**解析**：在Java中，抛出异常使用throw关键字，且必须抛出Throwable或其子类的实例。选项B正确，因为throw new ServiceException()创建并抛出了异常实例。选项A使用raise，这是Python语法；选项C的throws用于声明异常；选项D缺少new，不能抛出未实例化的类。

---

### 163. 单选题

当用Swing编写GUI程序时，下列说法中正确的是（　）

- A. Swing类一定要实现Runnable接口
- B. Swing类是Thread类
- C. Swing类是Thread类并且要实现Runnable接口
- D. Swing类是JComponent类的子类

**答案**：D
**解析**：Swing组件通常继承自JComponent类，JComponent是Swing组件的基础类。A、B、C选项错误，因为Swing类不要求实现Runnable接口或继承Thread类，这些与多线程相关，并非Swing组件的必要特性。

---

### 164. 单选题

关于封装的描述，下面说法错误的是（　）

- A. 封装将变化隔离
- B. 封装提高安全性
- C. 封装提高代码复用性
- D. 封装只针对成员变量

**答案**：D
**解析**：封装不仅针对成员变量，还包括方法等内部实现细节，通过访问控制符隐藏内部细节，提高安全性和复用性，隔离变化。选项D说法过于绝对，因此错误。

---

### 165. 单选题

当编译并且运行下面程序时会出现（　）结果。
```java
public class ThrowsDemo{
    public static void throwMethod() throws IOException{
        System.out.println("Inside throwMethod");
        throw new IOException("demo");
    }
    public static void main(String args[]){
        try{
            throwMethod();
        }catch(IOException e){
            System.out.println("Caught");
        }
    }
}
```

- A. 编译错误
- B. 运行错误
- C. 编译成功，但是不会打印任何结果
- D. 编译成功，打印Caught

**答案**：D
**解析**：程序编译成功，因为throwMethod声明抛出IOException，main方法中捕获了该异常。运行时，throwMethod抛出IOException，被catch块捕获，打印"Caught"。选项A错误，因为代码无编译错误；选项B错误，因为异常被捕获；选项C错误，因为会打印结果。

---

### 166. 单选题

下面的集合不能直接遍历Iterator迭代器代码的是（　）

- A. java.util.HashSet
- B. java.util.ArrayList
- C. java.util.Map
- D. java.util.TreeSet

**答案**：C
**解析**：Map不直接继承Iterable接口，不能直接使用Iterator迭代器遍历。HashSet、ArrayList、TreeSet都实现了Iterable接口，可以直接使用Iterator遍历。

---

### 167. 单选题

下列方法不是在编译时被绑定的是（　）

- A. 静态方法
- B. final方法
- C. private方法
- D. 重写的方法

**答案**：D
**解析**：静态方法、final方法和private方法在编译时根据类型确定调用版本，属于静态绑定。而重写的方法在运行时根据实际对象类型确定调用版本，属于动态绑定，因此不是在编译时被绑定。

---

### 168. 单选题

下列选项中属于单例设计模式的类是（　）

- A. Math
- B. Runtime
- C. System
- D. Random

**答案**：B
**解析**：Runtime类采用单例模式，通过静态方法getRuntime()获取唯一实例。Math类所有方法都是静态的，没有实例化需求；System类构造器私有但提供静态方法，并非严格单例；Random类可创建多个实例。因此正确答案是B。

---

### 169. 单选题

（　）对话框允许用户选择颜色。

- A. JColorChooser
- B. JFileChooser
- C. JChoiceColor
- D. JDialog

**答案**：A
**解析**：JColorChooser是Swing中用于选择颜色的标准对话框组件，提供颜色选择界面。JFileChooser用于文件选择，JChoiceColor不存在，JDialog是通用对话框基类，不专门用于颜色选择。

---

### 170. 单选题

File类中list()方法的返回类型是（　）

- A. File[]
- B. String[]
- C. String
- D. int

**答案**：B
**解析**：File类的list()方法返回当前目录下所有文件和目录的名称字符串数组，因此返回类型是String[]。选项A的File[]是listFiles()方法的返回类型，选项C和D类型错误。

---

### 171. 单选题

在程序下画线处填入正确选项是（　）
```java
public class Test2 ____________{
    public static void main(String args[]){
        Thread t=new Test2();
        t.start();
    }
    public void run(){
        System.out.println("How are you");
    }
}
```

- A. implements Thread
- B. extends Runnable
- C. implements Runnable
- D. extends Thread

**答案**：D
**解析**：正确选项是D。因为Test2类需要创建线程并调用start()方法，所以必须继承Thread类或实现Runnable接口。但选项A和B语法错误（implements后应为接口，extends后应为类），选项C实现Runnable接口后，还需将实例传给Thread构造器，而代码中直接new Test2()并调用start()，只有继承Thread类才能直接调用start()方法。

---

### 172. 单选题

关于StringBuffer和StringBuilder说法正确的是（　）

- A. StringBuffer和StringBuilder的方法不同
- B. StringBuffer和StringBuilder都是线程安全的
- C. StringBuffer是线程安全的，StringBuilder不是线程安全的
- D. StringBuffer不是线程安全的，StringBuilder是线程安全的

**答案**：C
**解析**：StringBuffer和StringBuilder的方法基本相同，区别在于StringBuffer是线程安全的（方法使用synchronized修饰），而StringBuilder不是线程安全的。因此选项C正确。A错误，方法相同；B错误，StringBuilder非线程安全；D错误，两者安全描述反了。

---

### 173. 单选题

下面关于java.util.Random类中方法，说法错误的是（　）

- A. nextDouble()方法返回的是0.0和1.0之间double类型的值
- B. nextFloat()方法返回的是0.0和1.0之间float类型的值
- C. nextInt(int n)返回的是0(包括)和指定值n(不包括)之间的值
- D. nextInt()返回的是0(包括)和2147483647之间的值

**答案**：D
**解析**：nextInt()方法返回的是int范围内的随机整数，包括负数，并非仅限于0到2147483647之间。A、B、C选项描述均正确。

---

### 174. 单选题

阅读下面代码，下列选项中，哪一个是程序执行后的结果（　）
```java
import java.util.ArrayList;
public class Test {
    public static void main(String[] args) {
        ArrayList list = new ArrayList();
        list.add("aaa");
        list.add("bbb");
        list.add("ccc");
        for (Object obj : list) {
            if (obj.equals("bbb"))
                list.remove(obj);
        }
        System.out.println(list);
    }
}
```

- A. [aaa,ccc]
- B. [aaa,bbb,ccc]
- C. []
- D. 以上都不对

**答案**：A
**解析**：程序使用增强for循环遍历ArrayList，当遇到"bbb"时执行remove操作，导致集合大小改变，循环内部出现并发修改异常（ConcurrentModificationException），因此程序不会正常输出列表，而是抛出异常。选项A、B、C均不正确，故选择D。

---

### 175. 单选题

当执行某种特定的用户操作，如点击JButton时，所产生的一个事件对象将被传送至（　）

- A. 事件驱动程序
- B. 操作方法
- C. 事件处理程序
- D. 操作驱动程序

**答案**：C
**解析**：在Java Swing中，当用户点击JButton时，会生成一个ActionEvent事件对象，该对象被传送至注册的事件处理程序（即实现了ActionListener接口的类中的actionPerformed方法）。事件处理程序负责响应事件。选项A、B、D均不是标准的事件处理机制术语。

---

### 176. 单选题

Java中，如果类C是类B的子类，类B是类A的子类，那么下面描述正确的是（　）

- A. C可以继承B中的公有成员，同样也可以继承A中的公有成员
- B. C只能继承B中的成员
- C. C只能继承A中的成员
- D. C不能继承A或B中的成员

**答案**：A
**解析**：在Java中，继承具有传递性。类C继承自类B，类B继承自类A，因此类C可以继承类B和类A中的公有成员（包括public和protected成员）。选项A正确描述了这一特性。选项B和C错误，因为C不仅能继承B的成员，也能继承A的成员。选项D完全错误。

---

### 177. 单选题

```java
class Parent {
    public void count() {System.out.println(10%3);}
}
public class Child extends Parent{
    public void count() {System.out.println(10/3);}
    public static void main(String[] args) {
        Parent p = new Child();
        p.count();
    }
}
```
以上代码运行结果是（　）

- A. 1
- B. 1.0
- C. 3
- D. 3.3333333333333335

**答案**：C
**解析**：代码中，Parent类的count方法输出10%3的结果，即1；Child类重写count方法输出10/3的结果，即整数除法3。但main方法中，p的静态类型为Parent，动态类型为Child，调用count方法时执行子类重写的方法，输出10/3=3。因此输出3，对应选项C。注意：10/3是整数除法，结果为3，不是浮点数。

---

### 178. 单选题

新建一个流对象，代码错误的是（　）

- A. new BufferedWriter(new FileWriter("a.txt"));
- B. new BufferedReader(new FileInputStream("a.dat"));
- C. new BufferedOutputStream(new FileOutputStream("a.zip"));
- D. new ObjectInputStream(new FileInputStream("a.dat"));

**答案**：B
**解析**：选项B错误，因为BufferedReader的构造参数应为Reader类型，而FileInputStream是InputStream类型，类型不匹配。其他选项均正确：A中BufferedWriter包装FileWriter，C中BufferedOutputStream包装FileOutputStream，D中ObjectInputStream包装FileInputStream，均符合流嵌套规则。

---

### 179. 单选题

下列选项中，FileReader文件创建语句正确的是（　）

- A. new FileReader(File file)
- B. read()
- C. new FileWriter(File file)
- D. ready()

**答案**：A
**解析**：FileReader的构造方法可以接收File对象，即new FileReader(File file)是正确的。选项B和D是方法调用，不是构造语句。选项C是FileWriter的构造，与题目要求的FileReader不符。

---

### 180. 单选题

下列关于线程的说法中正确的是（　）

- A. 创建线程立即运行
- B. start()使线程进入就绪队列，不一定立刻运行
- C. yield()后线程一定排在就绪队列最前面
- D. 拿到锁直接进入运行状态

**答案**：B
**解析**：选项B正确，因为start()方法将线程放入就绪队列，等待CPU调度，不一定立即运行。A错误，创建线程后需调用start()才进入就绪状态。C错误，yield()仅让出CPU，线程仍留在就绪队列，优先级不变，不保证排在最前。D错误，拿到锁后进入就绪状态，而非直接运行。

---

### 181. 单选题

File类构造方法格式错误的是（　）

- A. new File(String parent, File child)
- B. new File(String parent, String child)
- C. new File(String pathname)
- D. 以上都正确

**答案**：A
**解析**：File类构造方法包括：File(String pathname)、File(String parent, String child)、File(File parent, String child)。选项A中参数类型为(String parent, File child)是错误的，因为第二个参数应为String类型。

---

### 182. 单选题

（　）的getPoint方法返回鼠标坐标Point对象。

- A. Point
- B. JPanel
- C. MouseEvent
- D. Graphics

**答案**：C
**解析**：MouseEvent的getPoint方法返回鼠标事件发生时的坐标Point对象。其他选项：Point是坐标类，无getPoint方法；JPanel是容器，无此方法；Graphics是绘图上下文，也无此方法。

---

### 183. 单选题

线程阻塞，哪种情况不会直接进入可运行状态（　）

- A. sleep时间到
- B. 获得对象锁
- C. t.join()等待线程结束
- D. wait()被唤醒

**答案**：C
**解析**：线程阻塞后，sleep时间到、获得对象锁、wait()被唤醒都会直接进入可运行状态。而t.join()等待线程结束后，线程会进入就绪状态，但不会直接进入可运行状态，因为需要等待CPU调度。

---

### 184. 多选题

FlowLayout组件排列规则是（　）

- A. 从上到下
- B. 从左到右
- C. 从下到上
- D. 从右到左

**答案**：A、B
**解析**：FlowLayout默认在一行中按从左到右排列组件，当一行空间不足时换到下一行，因此整体上也体现为从上到下排列。正确答案是A、B。

---

### 185. 单选题

关于异常说法正确的是（　）

- A. 异常是一种对象
- B. 程序运行就会创建异常
- C. 尽量避免异常控制提升速度
- D. 以上都不对

**答案**：A
**解析**：在Java中，异常是Throwable类的实例，因此异常是一种对象。选项B错误，因为异常只在特定条件下创建，并非程序运行就会创建。选项C错误，异常控制用于处理错误，不应为避免异常而牺牲程序健壮性。因此A正确。

---

### 186. 单选题

Java集合类存放于哪个包（　）

- A. java.util
- B. java.lang
- C. java.array
- D. java.collections

**答案**：A
**解析**：Java集合类（如List、Set、Map等）存放于java.util包中。java.lang包包含基础类，java.array不存在，java.collections是工具类Collections的包，但集合接口和类主要在java.util中。

---

### 187. 单选题

RandomAccessFile中设置文件指针位置的方法是（　）

- A. readInt()
- B. readLine()
- C. seek()
- D. close()

**答案**：C
**解析**：RandomAccessFile的seek()方法用于设置文件指针位置，实现随机读写。readInt()和readLine()用于读取数据，close()用于关闭文件，均不能设置指针位置。

---

### 188. 单选题

以下属于Java引用数据类型的是（　）

- A. int
- B. double
- C. String
- D. boolean

**答案**：C
**解析**：Java引用数据类型包括类、接口和数组。String是类，属于引用数据类型。int、double、boolean是基本数据类型。

---

### 189. 单选题

在多线程并发程序设计中，能够给对象x加锁的语句是（　）

- A. x.wait()
- B. synchronized(x)
- C. x.notify()
- D. x.notifyAll()

**答案**：B
**解析**：synchronized(x) 是 Java 中用于给对象 x 加锁的同步语句，确保同一时刻只有一个线程能执行该代码块。其他选项：wait()、notify()、notifyAll() 是线程间通信方法，必须在同步块内使用，本身不加锁。

---

### 190. 单选题

可以使当前同级线程重新获得运行机会的方法是（　）

- A. sleep()
- B. join()
- C. yield()
- D. interrupt()

**答案**：C
**解析**：yield()方法的作用是暂停当前正在执行的线程对象，并执行其他线程，它会让当前线程从运行状态回到就绪状态，从而让同优先级的其他线程有机会运行。sleep()是让线程休眠指定时间，不释放锁；join()是等待调用线程执行完毕；interrupt()是中断线程。因此，只有yield()能使当前同级线程重新获得运行机会。

---

### 191. 单选题

BufferedReader类的（　）方法能够读取文件中的一行。

- A. readLine()
- B. read()
- C. line()
- D. close()

**答案**：A
**解析**：BufferedReader类的readLine()方法用于读取一行文本，返回字符串，不包含换行符。read()读取单个字符，line()不存在，close()关闭流。

---

### 192. 单选题

Writer的write(int ch)的作用是（　）

- A. 将对应于整型参数ch的低字节字符写入
- B. 将字符串数组ch的内容写入
- C. 将字符串ch写入
- D. 这是一个抽象方法，从开始将方法中的length个字符写入

**答案**：A
**解析**：Writer的write(int ch)方法将整型参数ch的低16位作为字符写入输出流，即写入一个字符。选项A正确描述了该功能。选项B和C分别对应write(char[])和write(String)方法。选项D描述的是write(char[], int, int)方法。

---

### 193. 单选题

File类的mkdir方法返回值的类型是（　）

- A. boolean
- B. int
- C. String
- D. Integer

**答案**：A
**解析**：File类的mkdir()方法用于创建目录，成功返回true，失败返回false，因此返回值类型为boolean。其他选项int、String、Integer均不符合API定义。

---

### 194. 单选题

在Java中，下列集合类型可以存储无序、不重复的数据的是（　）

- A. ArrayList
- B. LinkedList
- C. TreeSet
- D. HashSet

**答案**：D
**解析**：HashSet基于哈希表实现，不保证顺序且元素唯一，符合无序、不重复的要求。ArrayList和LinkedList有序且允许重复。TreeSet虽不重复但按自然顺序或比较器排序，并非无序。

---

### 195. 单选题

下列关于String和StringBuilder说法正确的是（　）

- A. String是线程不安全的，StringBuilder是线程安全的
- B. String是线程不安全的，StringBuilder也是线程不安全的
- C. String是不可变的，StringBuilder是可变的
- D. String是不确定的，StringBuilder是线程安全的

**答案**：C
**解析**：String是不可变类，任何修改都会创建新对象；StringBuilder是可变的，修改在原对象上进行。A错误，String不可变所以线程安全，StringBuilder线程不安全；B错误，String线程安全；D错误，String不可变且线程安全。

---

### 196. 单选题

阅读下列代码，写出运行结果。
```java
class Person {
    private String name;
    private int age;
    public void setName(String name) {
        this.name = name;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public void print() {
        System.out.println("执行构造方法");
    }
}
public class Test {
    public static void main(String[] args) {
        Person p = new Person();
        p.print();
        System.out.println(p.name + "," + p.age);
    }
}
```

- A. 执行构造方法。null,0
- B. 执行构造方法。null,null
- C. 执行构造方法。编译报错
- D. 执行构造方法。0,0

**答案**：C
**解析**：代码中name和age是私有成员变量，在Test类中无法直接访问，因此p.name和p.age编译报错。选项C正确。A、B、D均假设可以访问私有变量，错误。

---

### 197. 单选题

`TreeSet<String> tree = new TreeSet<>();` 向集合中存入对象时，该对象所属的类必须实现（　）接口。

- A. Comparable
- B. Runnable
- C. Serializable
- D. 以上都不对

**答案**：A
**解析**：TreeSet基于TreeMap实现，元素按自然顺序或比较器排序。存入对象时，若未指定比较器，则对象必须实现Comparable接口以定义排序规则。Runnable用于线程，Serializable用于序列化，均非必需。

---

### 198. 单选题

阅读下面代码，程序运行后的结果是（　）
```java
List<String> list = new ArrayList<>();
list.add("aaa");
list.add("bbb");
for (String str : list) {
    if (str.equals("bbb")) {
        list.remove(str);
    }
}
System.out.println(list);
```

- A. [aaa]
- B. [aaa, bbb]
- C. 抛出异常
- D. 以上都不对

**答案**：C
**解析**：增强for循环是Iterator迭代器的语法糖，ArrayList迭代器在创建时记录expectedModCount。当在循环中调用list.remove()时，modCount自增，但expectedModCount不变。迭代器下一次hasNext()校验时发现modCount≠expectedModCount，抛出ConcurrentModificationException。因此程序不会正常执行到println语句，输出不是[aaa]而是抛出异常。正确删除方式：使用Iterator.remove()或倒序普通for循环。所以正确答案是C。

---

### 199. 单选题

下列关于线程优先级的描述，错误的是（　）

- A. NORM_PRIORITY代表普通优先级，默认值是5
- B. 一般情况下，主线程具有普通优先级
- C. 优先级高的线程获得CPU执行权的几率越大
- D. 优先级高的线程就一定会先执行

**答案**：D
**解析**：线程优先级高只意味着获得CPU执行权的几率大，但并不保证一定会先执行，因为线程调度还依赖于操作系统和JVM的具体实现。选项D说法绝对，因此错误。其他选项均正确。

---
### 200. 多选题

下列关于System类的描述中，正确的有（　）

- A. System类是final修饰的，所以它不能被继承
- B. System类不能被实例化
- C. System类中提供了很多静态的属性
- D. System类中有获取当前系统属性的字段

**答案**：A、B、C
**解析**：A正确，System被声明为final。B正确，其构造方法是private的。C正确，如in、out、err等静态属性。D错误，获取系统属性要通过getProperties()方法，没有对应的公开字段。

---

### 201. 单选题

StringBuilder类的append()方法的返回值类型是（　）

- A. String
- B. StringBuilder
- C. StringBuffer
- D. String[]

**答案**：B
**解析**：StringBuilder类的append()方法返回StringBuilder对象自身，以便支持链式调用。其他选项：A String是字符串常量类，C StringBuffer是线程安全版本，D String[]是字符串数组，均不符合。

---
### 202. 多选题

下列关于Thread类的方法中，正确的有（　）

- A. sleep()方法可以阻止当前线程的执行
- B. wait()方法调用后，其他线程可以运行
- C. join()方法调用完毕后，该线程会自动结束
- D. 多个线程同时访问同一个变量时，可以使用join()来解决

**答案**：A、B
**解析**：A正确，sleep()使当前线程暂停指定时间。B正确，wait()会释放锁并等待，其他线程得以运行。C错误，join()是等待调用它的线程执行完毕，不是让线程结束。D错误，解决多线程访问同一变量的同步问题应当用synchronized、Lock或volatile，join()无法解决变量访问冲突。

---

### 203. 单选题

先阅读下面的程序片段：
```java
String str = "ab,cde,fgh";
String[] arr = str.split(",");
System.out.println(arr.length);
```
程序执行后打印出的结果是（　）

- A. 2
- B. 3
- C. 4
- D. 5

**答案**：B
**解析**：字符串"ab,cde,fgh"以逗号分隔，得到三个子串："ab"、"cde"、"fgh"，因此数组长度为3。

---

---

### 204. 判断题

Java 是一种编译型与解释型相结合的语言，源代码先编译成字节码，再由 JVM 解释执行。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：Java 源文件先由 javac 编译成 .class 字节码，再由 JVM 加载并解释（或即时编译）执行，因此是编译与解释相结合。

---

### 205. 判断题

在 Java 中，一个源文件里可以定义多个类，但最多只能有一个 public 类，且文件名必须与 public 类名相同。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：Java 允许一个 .java 文件包含多个类，但 public 类只能有一个，且文件名必须与它一致，否则编译报错。

---

### 206. 判断题

Java 中的 String 是基本数据类型。( )

- A. 正确
- B. 错误

**答案**：B
**解析**：String 是引用类型（java.lang.String 类）。Java 的基本数据类型只有 8 种：byte、short、int、long、float、double、char、boolean。

---

### 207. 判断题

子类可以继承父类的构造方法。( )

- A. 正确
- B. 错误

**答案**：B
**解析**：构造方法不能被继承。子类只能通过 super(...) 显式调用父类的构造方法。

---

### 208. 判断题

抽象类中可以不包含任何抽象方法。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：抽象类可以有零个或多个抽象方法。只要类被声明为 abstract，即使没有抽象方法也不能被实例化。

---

### 209. 判断题

Java 中的接口可以多继承，一个接口可以同时继承多个接口。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：类只能单继承，但接口支持多继承，例如 interface C extends A, B {} 是合法的。

---

### 210. 判断题

String 对象一旦创建，其内容就不能被修改。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：String 是不可变类（immutable），任何「修改」操作实际上都是创建了一个新对象。

---

### 211. 判断题

ArrayList 和 LinkedList 都实现了 List 接口，两者的随机访问效率相同。( )

- A. 正确
- B. 错误

**答案**：B
**解析**：两者都实现 List，但底层结构不同：ArrayList 基于数组，随机访问 O(1)；LinkedList 基于链表，随机访问 O(n)。

---

### 212. 判断题

HashMap 中的键（key）是允许重复的。( )

- A. 正确
- B. 错误

**答案**：B
**解析**：HashMap 的键不可重复，重复放入同一个键会覆盖旧值；值（value）可以重复。

---

### 213. 判断题

Java 中的异常分为受检异常（Checked Exception）和非受检异常（Unchecked Exception）两大类。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：受检异常必须显式处理或声明抛出（如 IOException）；非受检异常继承自 RuntimeException，编译器不强制处理。

---

### 214. 判断题

try-catch-finally 中，finally 块只在发生异常时才会执行。( )

- A. 正确
- B. 错误

**答案**：B
**解析**：finally 块无论是否发生异常都会执行（除非 JVM 退出），常用于释放资源。

---

### 215. 判断题

使用 FileReader 读取文件时，读取到流末尾会返回 -1。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：FileReader.read() 到达流末尾时返回 -1，这是 Java IO 中表示流结束的统一约定。

---

### 216. 判断题

创建线程只有一种方式，就是继承 Thread 类。( )

- A. 正确
- B. 错误

**答案**：B
**解析**：创建线程主要有两种方式：继承 Thread 类，或实现 Runnable 接口（后者更推荐，因为不占用继承名额）。

---

### 217. 判断题

线程调用 start() 方法后不会立即执行，而是进入就绪状态等待 CPU 调度。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：start() 只是让线程进入就绪（Runnable）状态，具体何时运行由线程调度器决定；直接调用 run() 则是在当前线程中普通执行。

---

### 218. 判断题

Swing 中的容器分为顶层容器和中间容器，JFrame 属于顶层容器。( )

- A. 正确
- B. 错误

**答案**：A
**解析**：JFrame、JDialog、JApplet 是顶层容器，可以独立存在；JPanel、JScrollPane 等中间容器必须放在其他容器里。

---

### 219. 单选题

某高校软件学院要开发一套学生成绩管理系统，用来替代目前用 Excel 手工维护的方式。项目组已经完成需求调研，下面是整理出来的材料。请完整阅读后再作答。

【一、业务背景】

学院下设软件工程、网络工程、人工智能、数据科学四个专业。每个专业在每个学期开设若干门课程。一门课程有课程号、课程名、学分、学时四个属性，其中学分是 0.5 的整数倍（例如 1.0、2.5、4.0）。每个学生属于且仅属于一个专业，入学时确定，但允许在第二学年结束之前申请转专业一次。学生每学期选修若干门课程，学期结束后由任课教师录入百分制成绩，成绩是 0 到 100 之间的整数，也允许记为空（表示缺考或尚未录入）。

每学期结束后，教务员会把这学期的成绩归档。归档之后该学期的成绩不允许再修改，但成绩单查询要能一直查到归档之前的数据。系统至少要保留最近八个学年的成绩记录，更早的数据可以下线，但不能在归档当期就被清掉。

系统里有三种角色，各自能做的事情不同：

- 任课教师：只能录入和修改自己所授课程的成绩，看不到其他课程的数据。
- 教务员：可以查询任意学生在任意学期的成绩单，也可以查询任意一门课程的成绩统计。
- 学院管理员：维护专业、课程、学生这三类基础数据。

【二、已经与各角色逐一确认过的约束】

1. 基础数据要能被单独维护。专业、课程、学生、选课记录、成绩这五类信息各自独立，修改其中一类不能影响其他类。

2. 学生转专业之后，转专业之前产生的历史成绩必须完整保留；并且在按专业统计时，这些成绩要仍然归属到**当时**就读的那个专业，不能因为学生现在的专业变了就跟着一起变。

3. 同一门课程可以被多个专业同时开设。例如「程序设计基础」这门课，软件工程专业记 4 学分，网络工程专业记 3 学分，两个专业的成绩统计互不干扰，学分也各算各的。

4. 教师录入成绩之后允许修改，但修改不能覆盖原来的值，而要追加一条修改记录，记录里包含修改人、修改时间、修改前后的值。查询成绩时以最后一次修改的结果为准，同时还要能查到一个学生某门课的完整修改历史。

5. 一个学生在同一学期内不能重复选修同一门课程。

6. 查询响应速度要求：当选课记录增长到十万条量级时，学生成绩单查询和课程成绩统计都要在 1 秒之内返回结果。

7. 缺考和「尚未录入」是两种不同的状态，不能混为一谈。缺考表示学生没有参加考试，成绩单上要显示「缺考」；尚未录入表示教师还没有提交，成绩单上要显示「待录入」。这两种情况都不参与平均分的计算，也不能当成 0 分拉低统计结果。

8. 每学期结束后由教务员归档该学期成绩，归档之后这一学期的成绩不允许再修改，但归档数据要始终可查。系统至少保留最近八个学年的成绩记录。

【三、目前实现出来的核心代码】

```java
public class ScoreService {

    // 所有成绩塞进一个 Map，键是"学号_课程号"
    private Map<String, Integer> scores = new HashMap<>();

    public void add(String studentId, String courseId, int score) {
        scores.put(studentId + "_" + courseId, score);
    }

    public int get(String studentId, String courseId) {
        return scores.get(studentId + "_" + courseId);
    }

    public double average(String courseId) {
        int sum = 0;
        int count = 0;
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            if (entry.getKey().endsWith("_" + courseId)) {
                sum += entry.getValue();
                count++;
            }
        }
        return sum / count;
    }

    public void update(String studentId, String courseId, int score) {
        scores.put(studentId + "_" + courseId, score);
    }
}
```

【四、问题】

对照上面第二节列出的八条约束，这段实现在设计上最主要的问题是（　）

- A. get() 方法在查不到对应记录时会抛出 NullPointerException，因为把一个 null 的 Integer 自动拆箱成了 int
- B. 用「学号_课程号」这个字符串当键，既表达不了学期、专业归属和修改历史，又让 average() 只能全表扫描做后缀匹配，第二节的约束 1、2、3、4、6、8 一条都满足不了
- C. HashMap 不是线程安全的，多位教师同时录入成绩时会导致数据丢失
- D. 应该把 int 换成 Integer，否则无法区分缺考和尚未录入

**答案**：B
**解析**：题目问的是「对照需求最主要的问题」，所以必须从需求出发判断，而不是看到这段代码有什么毛病就选什么。A 确实存在——`get()` 查不到记录时返回 null，直接赋值给 int 会拆箱抛 NPE；C 也确实是 HashMap 的真实缺陷；D 指出的方向也对，缺考和待录入确实要区分，也确实不能再用 int。但这三条都不是「对照需求」的主问题：需求里没有要求多线程并发写入，NPE 属于编码细节，而缺考状态改个类型只是局部改动。真正的问题在数据模型本身——`studentId + "_" + courseId` 这个字符串键只能表达「某学生对某门课有一个分数」，而约束要求区分学期（约束 1、5）、区分专业归属并保留转专业前的历史（2、3）、保留完整修改历史（4）、在十万级数据下快速查询（6）、支持归档后只读且长期保留（8），这套键值设计一条都表达不了；average() 只能遍历全部记录做字符串后缀匹配，既拿不到专业维度的数据，也达不到第 6 条的响应要求；约束 7 要求区分缺考与待录入，这个 Map 只存 Integer，两种状态都只剩一个 null，同样区分不了。因此 B 才是从需求出发的主问题。
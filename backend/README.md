# my_midway_project

## QuickStart

<!-- add docs here for user -->

see [midway docs][midway] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.


[midway]: https://midwayjs.org


卷积（Convolution）是信号处理和图像处理中的一种数学运算，广泛应用于卷积神经网络（CNN）中。卷积操作通过滑动一个滤波器（也称为卷积核）在输入数据上，并计算滤波器与输入数据的点积，从而提取特征。卷积的核心思想是通过滤波器来检测输入数据中的模式或特征。

### 卷积操作的步骤

以二维卷积为例，假设我们有一个输入矩阵和一个卷积核：

- 输入矩阵（例如，图像）：\( I \)
- 卷积核（例如，滤波器）：\( K \)

卷积操作的步骤如下：

1. **选择卷积核大小**：通常是一个较小的矩阵，例如 \( 3 \times 3 \) 或 \( 5 \times 5 \)。
2. **滑动卷积核**：从输入矩阵的左上角开始，逐个位置滑动卷积核。每次滑动一个步长（stride），步长可以是 1 或更大。
3. **计算点积**：在每个位置，将卷积核与输入矩阵的对应区域进行元素级的乘积，然后将这些乘积求和，得到一个单一的输出值。
4. **保存输出值**：将每次计算的结果保存到输出矩阵中的对应位置。

### 例子

假设有一个 \( 4 \times 4 \) 的输入矩阵 \( I \) 和一个 \( 2 \times 2 \) 的卷积核 \( K \)：

\[ I = \begin{bmatrix}
1 & 2 & 3 & 0 \\
4 & 5 & 6 & 1 \\
7 & 8 & 9 & 2 \\
0 & 1 & 2 & 3
\end{bmatrix} \]

\[ K = \begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix} \]

计算卷积的步骤如下：

1. 将卷积核放在输入矩阵的左上角，对应区域为：
\[ \begin{bmatrix}
1 & 2 \\
4 & 5
\end{bmatrix} \]

计算点积并求和：
\[ (1 \cdot 1) + (2 \cdot 0) + (4 \cdot 0) + (5 \cdot 1) = 1 + 0 + 0 + 5 = 6 \]

将结果保存到输出矩阵的对应位置。

2. 滑动卷积核一步，新的对应区域为：
\[ \begin{bmatrix}
2 & 3 \\
5 & 6
\end{bmatrix} \]

计算点积并求和：
\[ (1 \cdot 2) + (3 \cdot 0) + (5 \cdot 0) + (6 \cdot 1) = 2 + 0 + 0 + 6 = 8 \]

重复上述步骤，直到卷积核覆盖整个输入矩阵。

最终输出矩阵为：
\[ \begin{bmatrix}
6 & 8 & 3 \\
14 & 16 & 7 \\
8 & 10 & 11
\end{bmatrix} \]

### 卷积的实现

以下是一个简单的 Python 实现卷积操作的代码示例：

```python
import numpy as np

def convolve2d(input_matrix, kernel, stride=1, padding=0):
    # 输入矩阵的尺寸
    input_size = input_matrix.shape[0]
    kernel_size = kernel.shape[0]
    
    # 输出矩阵的尺寸
    output_size = int((input_size - kernel_size + 2 * padding) / stride) + 1
    output_matrix = np.zeros((output_size, output_size))
    
    # 在输入矩阵周围添加填充
    if padding > 0:
        input_matrix = np.pad(input_matrix, ((padding, padding), (padding, padding)), mode='constant')
    
    # 卷积操作
    for i in range(0, output_size):
        for j in range(0, output_size):
            region = input_matrix[i*stride:i*stride+kernel_size, j*stride:j*stride+kernel_size]
            output_matrix[i, j] = np.sum(region * kernel)
    
    return output_matrix

# 输入矩阵
I = np.array([[1, 2, 3, 0],
              [4, 5, 6, 1],
              [7, 8, 9, 2],
              [0, 1, 2, 3]])

# 卷积核
K = np.array([[1, 0],
              [0, 1]])

# 进行卷积操作
output = convolve2d(I, K)
print(output)
```

这个代码实现了一个简单的 2D 卷积操作，并输出了卷积结果。通过这个例子，可以更好地理解卷积的基本原理和实现方法。

池化（Pooling），也称为下采样（Downsampling）或子采样（Subsampling），是卷积神经网络（CNN）中的一种操作。池化的目的是减少特征图的尺寸，降低计算量和过拟合风险，同时保留重要特征。常见的池化操作包括最大池化（Max Pooling）和平均池化（Average Pooling）。

### 池化的基本概念

池化操作通过在特征图上滑动一个固定大小的窗口，并在该窗口内执行某种聚合操作（如取最大值或平均值）。池化通常伴随着步长（stride），步长决定了窗口滑动的步幅。

#### 最大池化（Max Pooling）
最大池化在每个窗口内取最大值。例如，假设我们有一个 \( 2 \times 2 \) 的窗口，在输入矩阵上滑动并取每个窗口中的最大值。

#### 平均池化（Average Pooling）
平均池化在每个窗口内取平均值。它计算窗口内所有值的平均值并将结果作为输出。

### 池化操作的步骤

以下是一个池化操作的具体示例，假设输入矩阵为：

\[ \begin{bmatrix}
1 & 2 & 3 & 0 \\
4 & 5 & 6 & 1 \\
7 & 8 & 9 & 2 \\
0 & 1 & 2 & 3
\end{bmatrix} \]

使用 \( 2 \times 2 \) 的窗口和步长为 2 进行最大池化：

1. 将窗口放在左上角，覆盖区域为：
\[ \begin{bmatrix}
1 & 2 \\
4 & 5
\end{bmatrix} \]

窗口内最大值为 5。

2. 滑动窗口到右侧，覆盖区域为：
\[ \begin{bmatrix}
3 & 0 \\
6 & 1
\end{bmatrix} \]

窗口内最大值为 6。

3. 移动窗口到下一行，覆盖区域为：
\[ \begin{bmatrix}
7 & 8 \\
0 & 1
\end{bmatrix} \]

窗口内最大值为 8。

4. 滑动窗口到右侧，覆盖区域为：
\[ \begin{bmatrix}
9 & 2 \\
2 & 3
\end{bmatrix} \]

窗口内最大值为 9。

最终输出矩阵为：
\[ \begin{bmatrix}
5 & 6 \\
8 & 9
\end{bmatrix} \]

### 池化的实现

以下是一个简单的 Python 实现池化操作的代码示例：

```python
import numpy as np

def max_pooling(input_matrix, pool_size, stride):
    input_size = input_matrix.shape[0]
    output_size = int((input_size - pool_size) / stride) + 1
    output_matrix = np.zeros((output_size, output_size))
    
    for i in range(0, output_size):
        for j in range(0, output_size):
            region = input_matrix[i*stride:i*stride+pool_size, j*stride:j*stride+pool_size]
            output_matrix[i, j] = np.max(region)
    
    return output_matrix

# 输入矩阵
I = np.array([[1, 2, 3, 0],
              [4, 5, 6, 1],
              [7, 8, 9, 2],
              [0, 1, 2, 3]])

# 进行最大池化操作
output = max_pooling(I, 2, 2)
print(output)
```

这个代码实现了一个简单的最大池化操作，并输出了池化结果。通过池化操作，可以有效减少特征图的尺寸，从而提高卷积神经网络的计算效率和鲁棒性。
/**
 * @file sudoku.cpp
 * @brief 数独を解くプログラム。
 * @author remin
 * @copyright (c) remin
 */
#include <iostream>
#include <array>
#include <vector>
using namespace std;

const int n = 3; // 数独の大きさ
const int m = n * n;
const int limit = 1; // 探索する解の個数の制限
typedef int bit; // 数字をビットの位置で表す型

// 整数をビットの位置で表します。
bit encode(int x) {
	return 1 << x;
}

// ビットの位置を整数で返します。
int decode(bit x) {
	int i;
	for (i = 0; i < m; i++) {
		if (x & 1 << i) {
			break;
		}
	}
	return i;
}

// グローバル変数
bit a[m * m];
int count;
vector<int> links[m * m];
vector<array<int, m * m>> solutions;

// 数独の解について深さ優先探索を行います。
void solve(int i) {
	if (solutions.size() >= limit) {
		return;
	}
	if (count == m * m) {
		array<int, m * m> t;
		for (int j = 0; j < m * m; j++) {
			t[j] = decode(a[j]) + 1;
		}
		solutions.push_back(t); // 完成した解を保存します。
	} else if (a[i]) {
		solve(i + 1);
	} else {
		bit g = 0;
		for (int j = 0; j < links[i].size(); j++) {
			g |= a[links[i][j]];
		}
		count++;
		for (bit j = 1; j < 1 << m; j <<= 1) {
			if ((j & g) == 0) {
				a[i] = j;
				solve(i + 1);
			}
		}
		a[i] = 0;
		count--;
	}
}

int main() {
	// 問題を入力します。
	count = 0;
	for (int i = 0; i < m * m; i++) {
		int x;
		cin >> x;
		if (x > 0 && x <= m * m) {
			a[i] = encode(x - 1);
			count++;
		} else {
			a[i] = 0;
		}
	}

	// 依存関係にあるマスの列を生成します。
	for (int i = 0; i < m; i++) {
		for (int j = 0; j < m; j++) {
			// 行
			for (int k = 0; k < m; k++) {
				if (k != j) {
					links[m * i + j].push_back(m * i + k);
				}
			}
			// 列
			for (int k = 0; k < m; k++) {
				if (k != i) {
					links[m * i + j].push_back(m * k + j);
				}
			}
			// 区画
			for (int ii = i / 3 * 3; ii < (i / 3 + 1) * 3; ii++) {
				for (int jj = j / 3 * 3; jj < (j / 3 + 1) * 3; jj++) {
					if (ii != i && jj != j) {
						links[m * i + j].push_back(m * ii + jj);
					}
				}
			}
		}
	}

	// 解を探索します。
	solutions.clear();
	solve(0);

	// 解を出力します。
	for (int i = 0; i < solutions.size(); i++) {
		for (int j = 0; j < m * m; j++) {
			cout << solutions[i][j];
			if (j % m == m - 1) {
				cout << endl;
			} else {
				cout << ' ';
			}
		}
		if (i < solutions.size() - 1) {
			cout << endl;
		}
	}
	return 0;
}

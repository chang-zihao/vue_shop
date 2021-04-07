<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe row-key="id">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和3级权限 -->
              <el-col :span="19">
                <!-- 通过for嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="waring"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!--  内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色id" prop="roleId">
          <el-input v-model="addForm.roleId"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!--  内容主体区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色id">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证id的规则
    var checkId = (rule, value, cb) => {
      // 验证id的正则表达式
      const regId = /[0-9]{2,5}/;
      if (regId.test(value)) {
        return cb();
      }
      cb(new Error("请输入2到5位数字作为id"));
    };
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制添加角色对话框显示和隐藏
      addDialogVisible: false,
      // 控制修改角色对话框显示和隐藏
      editDialogVisible: false,
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 在权限对话框中默认选中的节点id值
      defKeys: [],
      // 当前即将分配权限的角色的id
      roleId: "",
      //角色表单数据
      addForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      //添加角色表单验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3到10个字符之间",
            trigger: "blur",
          },
        ],
        roleId: [
          { required: true, message: "请输入id", trigger: "blur" },
          { validator: checkId, trigger: "blur" },
        ],
      },
      // 查询到的角色信息对象
      editForm: {},
      // 修改角色的验证规则对象
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名长度在2到10个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    // 获取所有角色数据
    this.getRolesList();
  },
  methods: {
    //定义获取所有角色数据的函数
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolelist = res.data;
      console.log(this.rolelist);
    },
    // 点击按钮，添加角色
    addRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败！");
        }
        this.$message.success("添加角色成功！");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    // 监听对话框关闭事件
    addDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 展示修改角色对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败！");
      }
      this.editForm = res.data;
    },
    // 修改角色信息并提交
    editRolesInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //发起修改角色信息的请求
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("编辑角色失败！");
        }
        // 编辑成功
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message.success("编辑角色成功！");
      });
    },
    // 根据id删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果确认删除，返回的是confirm，取消删除，返回cancel
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消了删除！");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败！");
      }
      this.$message.success("删除角色成功！");
      this.getRolesList();
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      //弹框提示用户，是否要删除
      const comfirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (comfirmResult !== "confirm") {
        // 用户点了取消，不想删除
        return this.$message.info("取消了删除！");
      }
      //用户点了确定
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      // 删除成功，刷新列表，这样删除权限后表格会重新渲染，展开列会关闭，不建议这样
      // this.getRolesList();
      // 删除之后，data里面的是最新的数据，可以重新赋值，这样就不用重新渲染
      role.children = res.data;
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      // 获取到当前点击的分配权限对应的角色的id
      this.roleId = role.id;
      // 先获取到数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败！");
      }
      // 把获取到权限数据保存到data里
      this.rightslist = res.data;
      // 检测是否获取成功
      console.log(this.rightslist);
      // 在显示对话框之前，递归获取三级权限节点的id
      this.getLeafKeys(role, this.defKeys);
      // 再显示对话框
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式获取角色下获取三级权限的id，并保存到defKeys中
    getLeafKeys(node, arr) {
      //判断是否为三级节点
      // 如果当前节点不包含children属性，就是三级节点
      if (!node.children) {
        // 是三级节点，就在一个数组里push这个节点的id
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件，关闭后清空数组
    setRightDialogClose() {
      this.defKeys = [];
    },
    // 在分配权限对话框，点击确定为角色分配权限
    async allotRights() {
      // 在数组里拿到所有半选中和全选中状态的id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功！");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>